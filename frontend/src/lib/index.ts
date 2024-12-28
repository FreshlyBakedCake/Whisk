import { getCollection, getEntry } from "astro:content"

export const formatTitle = async (postId: string): Promise<string | undefined> => {
	let post = await getEntry("blog", postId);

	if (!post) {
		return undefined;
	}

	if (post.data.displayName) {
		return post.data.displayName;
	}

	if (!post.filePath) {
		return undefined;
	}

	let name = post.filePath.split("/").at(-1)!;

	if (name.endsWith(".md")) {
		name = name.slice(0, name.length - 3);
	}

	name = decodeURI(name);

	if (import.meta.env.PUBLIC_TITLE_REGEX) {
		const matches = name.match(import.meta.env.PUBLIC_TITLE_REGEX);

		if (matches?.groups?.title) {
			name = matches.groups.title;
		}
	}

	return name;
}

export const findPostsWithTag = async (tag: string): Promise<string[]> => {
	let posts = await getCollection("blog", (post) => {
		return post.data.tags?.includes(tag)
	});
	return posts.map(p => p.id);
}
