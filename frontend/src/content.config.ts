import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { getSecret } from "astro:env/server";

export const blogSchema = z.object({
	displayName: z.string().optional(),
	tags: z.array(z.string()).optional(),
	publishedOn: z.coerce.date().optional(),
	published: z.boolean().default(false)
})

const blog = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: getSecret("BLOG_PATH"),
		generateId: (options) => {
			console.log(options.entry)
			let id: string;
			let fileName = options.entry.match(/\+\d+\s/);
			if (!fileName) {
				id = options.entry.split("/").at(-1)!;
			} else {
				id = parseInt(fileName[0]).toString()
			}
			return id;
		}
	}),
	schema: blogSchema
});

export const collections = { blog };
