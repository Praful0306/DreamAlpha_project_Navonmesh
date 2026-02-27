import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// AgriStoreSmart — Vite configuration
// Navomesh 2026 | Problem 26010
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,          // Use port 3000 to match backend CORS config
    open: true,          // Auto-open browser on dev start
    proxy: {
      // Proxy /api calls to FastAPI backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
