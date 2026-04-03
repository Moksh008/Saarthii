import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
    proxy: {
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
    }
  }
})
