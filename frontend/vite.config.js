/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",  
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  define: {
    "process.env": process.env,  
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./__tests__/setup.js",
  }
});