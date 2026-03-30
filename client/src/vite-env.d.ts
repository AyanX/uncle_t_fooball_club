/// <reference types="vite/client" />

// SCSS module type declarations
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

// Env variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
