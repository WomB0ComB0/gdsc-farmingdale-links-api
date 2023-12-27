import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import million from 'million/compiler';
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
  ],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
