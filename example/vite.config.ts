import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Markdown from 'vite-plugin-react-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Markdown(), react()],
})

