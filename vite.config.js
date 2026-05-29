import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { spaFallbackPlugin } from './scripts/spa-fallback-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  appType: 'spa',
  logLevel: 'error',
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
    /** Deep-link fallbacks: dist/404.html + per-route index.html copies; public/_redirects for static hosts */
    spaFallbackPlugin(),
  ],
  preview: {
    // Match production SPA behaviour when running npm run preview
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
