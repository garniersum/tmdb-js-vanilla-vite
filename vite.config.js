import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['js/services/tmdb.service.js'],
          'components': ['js/components/movie-card.js', 'js/components/navbar.js', 'js/components/modal.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
