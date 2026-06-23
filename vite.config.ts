import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'pwa-192.png', 'pwa-512.png'],
      manifest: {
        name: '趣玩 · 精品小游戏',
        short_name: '趣玩',
        description: '2048、贪吃蛇、记忆翻牌、反应力挑战',
        theme_color: '#0f0c29',
        background_color: '#0f0c29',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-CN',
        start_url: './',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: true,
  },
});
