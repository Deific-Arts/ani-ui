import { defineConfig } from 'vite';
import litCss from 'vite-plugin-lit-css';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    litCss({
      // your global and rel="stylesheet" styles must be excluded
      exclude: './src/index.scss'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Ani Book Quotes',
        short_name: 'Ani',
        description: 'Ani Book Quotes is social media designed for book lovers!',
        theme_color: '#111827',
        icons: [
          {
            src: 'icons/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
],
  build: {
    target: 'esnext'
  }
});
