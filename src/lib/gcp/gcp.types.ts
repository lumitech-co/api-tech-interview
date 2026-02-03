export enum FileTypes {
    AVATAR,
    LOGO,
    DOCUMENT,
    DICOM,
}

export type ConfigureFileKeyArg = {
    type: FileTypes.AVATAR;
    userId: string;
    fileName: string;
};

export interface UploadFileResponse {
    url: string; // Signed url for frontend to upload 15 mins validity
    key: string; // File key to save in database
}

export interface GetFileUrlResponse {
    url: string;
}
