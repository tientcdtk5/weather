/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APPID: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
