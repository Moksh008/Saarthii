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
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/admin': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/dashboard/citizen': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/dashboard/officer': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/dashboard/region': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/dashboard/admin': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/dashboard/ministry': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/analytics': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/complaints': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/departments': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/officers': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/officer': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
      '/notifications': {
        target: 'https://ps-crm-saarthi-public-grievance-portal.onrender.com',
        changeOrigin: true,
      },
    }
  }
})
