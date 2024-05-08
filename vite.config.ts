import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
// import million from 'million/compiler';
import eslint from 'vite-plugin-eslint';
import path from 'path';

// Resolve path to ESLint config file
const eslintConfigFile = path.resolve(__dirname, '.eslintrc.cjs');

export default defineConfig({
  plugins: [
    react(),
    // million.vite({
    //   auto: {
    //     rsc: true,
    //   },
    // }),
    eslint({
      include: ['./src/**/*.tsx', './src/**/*.ts'],
      exclude: ['node_modules/**', './src/**/*.d.ts'],
      overrideConfigFile: eslintConfigFile,
    }),
  ],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
