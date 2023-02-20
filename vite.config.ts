import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { wssPlugin } from './src/lib/server/wss';

export default defineConfig({
  plugins: [sveltekit(), wssPlugin()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
