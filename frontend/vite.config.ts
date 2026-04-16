import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/scrape': 'http://localhost:8080',
      '/traverse': 'http://localhost:8080',
      '/tree': 'http://localhost:8080',
    },
  },
})
