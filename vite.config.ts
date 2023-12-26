import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import million from 'million/compiler';
import { VitePWA } from 'vite-plugin-pwa'
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
        million.vite({
      auto: true,
    }),
    eslint({
      include: ['./src/**/*.tsx', './src/**/*.ts'],
      exclude: ['node_modules/**', './src/**/*.d.ts'],
    }),
    VitePWA({
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*'],
      },
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['**/*'],
    }),
  ],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
