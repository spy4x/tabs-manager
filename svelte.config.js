import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      '@components': './src/lib/client/components',
      '@stores': './src/lib/client/stores',
      '@models': './src/lib/shared/models',
    },
  },
};

export default config;
