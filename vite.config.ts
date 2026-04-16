import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // <- maps @ to src/
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/react-router-dom/')) {
            return 'react';
          }

          if (id.includes('/node_modules/@stripe/react-stripe-js/') || id.includes('/node_modules/@stripe/stripe-js/')) {
            return 'stripe';
          }

          if (id.includes('/node_modules/@radix-ui/')) {
            return 'radix';
          }

          if (id.includes('/node_modules/recharts/')) {
            return 'charts';
          }

          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
