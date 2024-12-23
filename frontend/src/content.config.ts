import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { getSecret } from "astro:env/server";

const blog = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: getSecret("BLOG_PATH"),
		generateId: (options) => {
			let id: string;
			let fileName = options.entry.match(/\+\d+\:/);
			if (!fileName) {
				id = options.entry.includes("/") ? options.entry.split("/").at(-1)! : options.entry;
			} else {
				id = parseInt(fileName[0]).toString()
			}
			return id;
		}
	}),
	schema: z.object({
		displayName: z.string(),
		tags: z.optional(z.array(z.string())),
		pubDate: z.coerce.date(),
        publish: z.boolean()
	})
});

export const collections = {blog};
