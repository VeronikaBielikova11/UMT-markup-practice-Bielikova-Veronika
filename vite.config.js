import { defineConfig } from 'vite';

export default defineConfig({
  base: '/UMT-markup-practice-Bielikova-Veronika/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
