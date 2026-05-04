import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // Path alias: Giúp import gọn hơn, VD: '@/components/...' thay vì '../../../components/...'
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  server: {
    port: 3000,
    // Chuyển hướng (Proxy) các request /api sang API Gateway cổng 8080
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})