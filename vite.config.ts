import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// All API routes are proxied to the FastAPI backend in development.
// In production, configure your reverse proxy (nginx/caddy) to forward these paths.
const API_TARGET = 'https://ps-crm-saarthi-public-grievance-portal.onrender.com';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      // Required for Firebase Auth popups (Google Sign-In)
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
    proxy: {
      '/auth':         { target: API_TARGET, changeOrigin: true },
      '/admin':        { target: API_TARGET, changeOrigin: true },
      '/complaints':   { target: API_TARGET, changeOrigin: true },
      '/dashboard':    { target: API_TARGET, changeOrigin: true },
      '/analytics':    { target: API_TARGET, changeOrigin: true },
      '/uploads':      { target: API_TARGET, changeOrigin: true },
      '/departments':  { target: API_TARGET, changeOrigin: true },
      '/officers':     { target: API_TARGET, changeOrigin: true },
      '/officer':      { target: API_TARGET, changeOrigin: true },
      '/notifications':{ target: API_TARGET, changeOrigin: true },
      '/whatsapp':     { target: API_TARGET, changeOrigin: true },
    }
  }
})
