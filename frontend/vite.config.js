import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, 
    proxy: {
      '/api': {
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'import.meta.env': JSON.stringify(process.env),
  },
});