// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import remarkWikiLink from '@portaljs/remark-wiki-link';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.SITE_URL,
	integrations: [tailwind()],
	output: `static`,
	markdown: {
		remarkPlugins: [
			remarkWikiLink,
			remarkGfm,
		]
	}
});
