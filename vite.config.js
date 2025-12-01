import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/zone01': {
        target: 'https://platform.zone01.gr',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/zone01/, ''),
      },
    },
  },
});
