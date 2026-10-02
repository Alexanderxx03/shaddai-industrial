import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'frontend',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/index.html'),
        products: resolve(__dirname, 'frontend/products.html'),
        checkout: resolve(__dirname, 'frontend/checkout.html'),
        auth: resolve(__dirname, 'frontend/auth.html')
      }
    }
  }
});
