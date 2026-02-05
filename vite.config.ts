import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/marketplace-b2b/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
})
