import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// All API routes are proxied to the FastAPI backend in development.
// In production, configure your reverse proxy (nginx/caddy) to forward these paths.
const API_TARGET = 'http://localhost:8000';

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
<<<<<<< HEAD
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
=======
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/dashboard/citizen': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/dashboard/officer': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/dashboard/region': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/dashboard/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/dashboard/ministry': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/analytics': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/complaints': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/departments': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/officers': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/officer': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/notifications': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
>>>>>>> b4e9f2ce64efbe9fdcc2496cadb92419fb0a6146
    }
  }
})
