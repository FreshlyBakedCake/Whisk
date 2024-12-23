// @ts-check
import { defineConfig } from 'astro/config';
import { getSecret } from 'astro:env/server';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: getSecret("BASE_URL"),
	integrations: [tailwind()]
});
