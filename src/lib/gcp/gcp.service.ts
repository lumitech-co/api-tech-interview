import { addMinutes } from "date-fns";
import { Storage } from "@google-cloud/storage";
import { EnvConfig } from "@/types/env.type.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { InternalServerError } from "@/lib/errors/errors.js";
import {
    ConfigureFileKeyArg,
    FileTypes,
    GetFileUrlResponse,
    UploadFileResponse,
} from "./gcp.types.js";

export type GcpService = {
    uploadFile: (params: {
        keyPayload: ConfigureFileKeyArg;
        mimeType: string;
    }) => Promise<UploadFileResponse>;
    getFileUrl: (key: string) => Promise<GetFileUrlResponse>;
    deleteFile: (key: string) => Promise<void>;
    deleteFolder: (prefix: string) => Promise<void>;
};

export const createGcpService = (config: EnvConfig): GcpService => {
    const storage = new Storage();

    const bucketName = config.GCP_BUCKET_NAME;

    const UPLOAD_URL_VALIDITY_MINUTES = 15;

    const configureFileKey = (p: ConfigureFileKeyArg): string => {
        if (p.type === FileTypes.AVATAR) {
            return `users/${p.userId}/avatars/${p.fileName}`;
        }

        throw new InternalServerError("Type for file key is required");
    };

    return {
        uploadFile: async (params) => {
            const { keyPayload, mimeType } = params;
            const fileKey = configureFileKey(keyPayload);

            const file = storage.bucket(bucketName).file(fileKey);

            // Signed url for upload 15 minutes validity
            const [url] = await file.getSignedUrl({
                version: "v4",
                action: "write",
                expires: addMinutes(new Date(), UPLOAD_URL_VALIDITY_MINUTES),
                contentType: mimeType,
            });

            return {
                url,
                key: fileKey,
            };
        },

        // Get signed url to access the file
        getFileUrl: async (key) => {
            return {
                url: `https://storage.googleapis.com/${bucketName}/${key}`,
            };
        },

        // Delete single file
        deleteFile: async (key) => {
            await storage.bucket(bucketName).file(key).delete();
        },

        // Delete files in folder
        deleteFolder: async (prefix) => {
            const bucket = storage.bucket(bucketName);

            await bucket.deleteFiles({
                prefix,
            });
        },
    };
};

addDIResolverName(createGcpService, "gcpService");
