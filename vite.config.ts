import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	esbuild: {
		jsxInject: `import React from 'react'`,
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
			"/swagger": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
		},
	},
});
