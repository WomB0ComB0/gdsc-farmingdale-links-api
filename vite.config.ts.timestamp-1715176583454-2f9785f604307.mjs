// vite.config.ts
import { defineConfig } from "file:///C:/Users/Mike%20Odnis/Documents/GitHub/gdsc-farmingdale-links-api/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Mike%20Odnis/Documents/GitHub/gdsc-farmingdale-links-api/node_modules/@vitejs/plugin-react/dist/index.mjs";
import million from "file:///C:/Users/Mike%20Odnis/Documents/GitHub/gdsc-farmingdale-links-api/node_modules/million/dist/packages/compiler.mjs";
import eslint from "file:///C:/Users/Mike%20Odnis/Documents/GitHub/gdsc-farmingdale-links-api/node_modules/vite-plugin-eslint/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    million.vite({
      auto: true
    }),
    eslint({
      include: ["./src/**/*.tsx", "./src/**/*.ts"],
      exclude: ["node_modules/**", "./src/**/*.d.ts"]
    })
  ],
  esbuild: {
    jsxInject: `import React from 'react'`
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNaWtlIE9kbmlzXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcZ2RzYy1mYXJtaW5nZGFsZS1saW5rcy1hcGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE1pa2UgT2RuaXNcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxnZHNjLWZhcm1pbmdkYWxlLWxpbmtzLWFwaVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTWlrZSUyME9kbmlzL0RvY3VtZW50cy9HaXRIdWIvZ2RzYy1mYXJtaW5nZGFsZS1saW5rcy1hcGkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IG1pbGxpb24gZnJvbSAnbWlsbGlvbi9jb21waWxlcic7XG5pbXBvcnQgZXNsaW50IGZyb20gJ3ZpdGUtcGx1Z2luLWVzbGludCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICAgICAgbWlsbGlvbi52aXRlKHtcbiAgICAgIGF1dG86IHRydWUsXG4gICAgfSksXG4gICAgZXNsaW50KHtcbiAgICAgIGluY2x1ZGU6IFsnLi9zcmMvKiovKi50c3gnLCAnLi9zcmMvKiovKi50cyddLFxuICAgICAgZXhjbHVkZTogWydub2RlX21vZHVsZXMvKionLCAnLi9zcmMvKiovKi5kLnRzJ10sXG4gICAgfSksXG4gIF0sXG4gIGVzYnVpbGQ6IHtcbiAgICBqc3hJbmplY3Q6IGBpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnYCxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZYLFNBQVMsb0JBQW9CO0FBQzFaLE9BQU8sV0FBVztBQUNsQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxZQUFZO0FBR25CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNGLFFBQVEsS0FBSztBQUFBLE1BQ2YsTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLGtCQUFrQixlQUFlO0FBQUEsTUFDM0MsU0FBUyxDQUFDLG1CQUFtQixpQkFBaUI7QUFBQSxJQUNoRCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
