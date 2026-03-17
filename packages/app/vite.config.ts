import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@soulbuilder/shared': resolve(__dirname, '../shared/index.ts'),
      '@soulbuilder/assessment': resolve(__dirname, '../assessment/src/index.ts'),
      '@soulbuilder/training': resolve(__dirname, '../training/src/index.ts'),
      '@soulbuilder/animation': resolve(__dirname, '../animation/src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
})
