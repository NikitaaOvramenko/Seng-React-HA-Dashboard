import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from "path"
import {VitePWA} from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind(),svgr(),VitePWA({registerType:'autoUpdate'})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/local/seng-dashboard-react/'
})
