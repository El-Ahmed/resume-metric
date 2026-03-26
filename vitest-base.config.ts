// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ...
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
  },
});
