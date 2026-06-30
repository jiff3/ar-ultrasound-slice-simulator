import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesBase = '/ar-ultrasound-slice-simulator/'
const base = process.env.DEPLOY_TARGET === 'github-pages' ? githubPagesBase : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
