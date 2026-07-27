import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/korban-bencana': 'http://localhost:3000',
      '/penyakit-genetik': 'http://localhost:3000',
      '/keturunan': 'http://localhost:3000',
      '/pasangan-hidup': 'http://localhost:3000',
      '/penelitian-ilmiah': 'http://localhost:3000',
      '/peningkatan-kinerja-atletik': 'http://localhost:3000'
    }
  }
})
