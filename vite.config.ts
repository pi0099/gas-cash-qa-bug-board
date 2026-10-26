import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project Pages URL: https://<user>.github.io/gas-cash-qa-bug-board/
const REPO_NAME = 'gas-cash-qa-bug-board'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 43127,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 43127,
    strictPort: true,
  },
})
