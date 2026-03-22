import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
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
    },
  },
});
