export type EnvConfig = {
    NODE_ENV: "development" | "production" | "test";
    HOST: string;
    DATABASE_URL: string;
    PORT: number;
    GCP_BUCKET_NAME: string;
    APPLICATION_SECRET: string;
    APPLICATION_URL: string;
    DOCS_PASSWORD: string | undefined;
};
