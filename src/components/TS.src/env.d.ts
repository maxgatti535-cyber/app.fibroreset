// Type definitions for Vite environment variables
interface ImportMetaEnv {
    VITE_GOOGLE_API_KEY: string;
    // add other env vars here if needed
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
