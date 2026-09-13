/**
 * True when the application is running in development mode OR when
 * VITE_ENABLE_DEBUG=true is set (e.g. on a Vercel staging deployment).
 *
 * Use this flag instead of `import.meta.env.DEV` directly so that
 * the DeveloperPanel and PerformanceLab can also be available on staging
 * without appearing in production.
 */
export const DEBUG_ENABLED: boolean =
  import.meta.env.DEV ||
  import.meta.env.VITE_ENABLE_DEBUG === "true";
