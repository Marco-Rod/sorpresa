/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Runtime environment: development | preview | production */
  readonly VITE_APP_ENV: "development" | "preview" | "production";

  /**
   * Set to "true" on non-production Vercel deployments to enable
   * the DeveloperPanel and PerformanceLab without a local dev server.
   */
  readonly VITE_ENABLE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
