import { defineConfig } from 'vite';

// Vercel deploys to root, so no base path needed
export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://platform.zone01.gr',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Remove duplicate CORS headers that cause browser errors
            const headers = proxyRes.headers['access-control-allow-origin'];
            if (headers) {
              proxyRes.headers['access-control-allow-origin'] = '*';
            }
          });
        }
      }
    }
  }
});
