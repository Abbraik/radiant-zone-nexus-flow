import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: [
      'src/tests/**/*.test.ts', 
      'src/**/__tests__/**/*.spec.ts',
      'src/services/capacity-decision/__tests__/**/*.spec.ts',
      'src/routing/__tests__/**/*.spec.ts',
      'src/tasks/__tests__/**/*.spec.ts',
      'src/playbooks/__tests__/**/*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});