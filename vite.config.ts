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
        id: 'ani-book-quotes',
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
        ],
        launch_handler: {
          client_mode: ['auto'],
        },
        orientation: 'portrait',
        screenshots: [{
            src: 'screenshot.png',
            sizes: '2865x1617',
            type: 'image/png',
        }],
        categories: ['productivity', 'social-networking', 'entertainment', 'literature'],
        dir: 'ltr',
        related_applications: [{
          platform: 'play',
          url: 'https://play.google.com/store/apps/details?id=me.guyca.kippi&hl=en_US',
          id: 'me.guyca.kippi',
        }],
        'prefer_related_applications': true,
        scope_extensions: [{ origin: '*.anibookquotes.com' }]
      },
      workbox: {
        runtimeCaching: [{
          handler: 'NetworkOnly',
          urlPattern: /\/api\/.*\/*.json/,
          method: 'POST',
          options: {
            backgroundSync: {
              name: 'aniQueue',
              options: {
                maxRetentionTime: 24 * 60
              }
            }
          }
        }]
      }
    })
],
  build: {
    target: 'esnext'
  }
});
