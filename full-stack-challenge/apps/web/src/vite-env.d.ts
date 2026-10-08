/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API base URL including the version prefix, e.g. http://localhost:3333/api/v1 */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
