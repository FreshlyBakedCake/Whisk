// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import remarkWikiLink, { getPermalinks } from '@portaljs/remark-wiki-link';
import remarkGfm from 'remark-gfm';
import path from 'node:path';
import deasync from 'deasync';

/** @type {(permalink: string) => Promise<string>} */
async function permalinkToHref(permalink) {
	if (permalink.endsWith(".md")) {
		// TODO: return URL of blog post if it is indeed a blog post
		return permalink;
	}
	
	const assetPath = path.join(
		process.env.SPACE_PATH ??
		process.env.BLOG_PATH ??
		process.exit(1), permalink);

	console.log({assetPath});

	return await import(path.toString());
}

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.SITE_URL,
	integrations: [tailwind()],
	output: `static`,
	markdown: {
		remarkPlugins: [
			[remarkWikiLink, {
				pathFormat: "raw",
				/** @type {(name: string) => string[]} */
				pageResolver: name => [name],
				permalinks: getPermalinks(
					process.env.SPACE_PATH
					?? process.env.BLOG_PATH
					?? process.exit(1)),
				hrefTemplate: permalinkToHref,
			}],
			remarkGfm,
		]
	}
});
