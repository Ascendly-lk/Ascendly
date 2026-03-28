import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure API_BASE in api.js resolves to localhost:8000 so MSW can intercept
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:8000'),
    'import.meta.env.DEV': JSON.stringify(false),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:5173',
      },
    },
    setupFiles: ['./component-tests/setup.ts'],
    include: ['component-tests/**/*.test.{ts,tsx}'],
    reporters: ['verbose', ['junit', { outputFile: 'results/junit/vitest-results.xml' }]],
    coverage: {
      reporter: ['text', 'json'],
    },
  },
  resolve: {
    alias: {
      // Point to actual frontend source so we import real components
      '@': path.resolve(__dirname, '../frontend/src'),
      // Resolve router/react packages from qa's node_modules (not frontend's)
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
});
