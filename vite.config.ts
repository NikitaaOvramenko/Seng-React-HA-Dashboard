import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from "path"
import {VitePWA} from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind(),svgr(),VitePWA({registerType:'autoUpdate',
  workbox:{
    globIgnores:['**/*.mp3'],
  },
  manifest:{
    name:'Seng Dashboard',
    short_name:'Dashboard',
    start_url:'/local/seng-dashboard-react/',
    display:"fullscreen",
    background_color:"#000000",
    theme_color:"#000000",
    icons:[
      { src:"/local/seng-dashboard-react/3d-house.png", sizes:"512x512", type:"image/png", purpose:"any" },
      { src:"/local/seng-dashboard-react/3d-house.png", sizes:"512x512", type:"image/png", purpose:"maskable" },
    ],
  }})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/local/seng-dashboard-react/'
})
