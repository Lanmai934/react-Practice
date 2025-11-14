import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 如果后端不带 /api 前缀，可取消注释进行重写
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
