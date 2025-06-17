import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      // Semua request yang diawali /api dialihkan ke backend
      '/api': {
        target: 'http://localhost:3001', // alamat backend Express
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '') // ← opsional, kalau backend TIDAK pakai prefix /api
      }
    }
  }
})
