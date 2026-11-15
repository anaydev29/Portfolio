import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three.js in its own file: only downloaded for the 3D hero, cached separately
        manualChunks: { three: ['three'] },
      },
    },
  },
})
