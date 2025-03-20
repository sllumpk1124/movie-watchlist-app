import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",  // ✅ Ensures Vite correctly serves static files
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  define: {
    "process.env": process.env,  // ✅ Keeps environment variables available
  },
});