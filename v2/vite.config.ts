import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      // Show a prompt instead of auto-reloading so an in-progress
      // celebration is never interrupted by a silent update.
      registerType: "prompt",

      injectRegister: "auto",

      includeAssets: [
        "favicon.svg",
        "icons/apple-touch-icon.png",
      ],

      manifest: {
        name: "Un jardín en septiembre",
        short_name: "Jardín",
        description:
          "Una pequeña sorpresa que florece en septiembre.",

        start_url: "/",
        scope: "/",
        display: "standalone",

        // No forced orientation — the experience should work in landscape
        // too (tablet, desktop), even though portrait is the primary target.

        theme_color: "#241d3b",
        background_color: "#17152f",

        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,

        navigateFallback: "/index.html",

        // Precache: only the app shell — no photos, audio or large assets.
        // Images are served by the runtime CacheFirst strategy below.
        globPatterns: [
          "**/*.{js,css,html,ico,svg,woff2}",
          "icons/*.png",
        ],

        runtimeCaching: [
          // Audio: never cached — files are large and may be copyrighted.
          {
            urlPattern: ({ request }) =>
              request.destination === "audio",
            handler: "NetworkOnly",
          },

          // Images (photos, pets, memories): cache on first access,
          // serve from cache on subsequent visits.
          {
            urlPattern: ({ request }) =>
              request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "garden-images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
