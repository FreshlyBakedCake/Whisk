import { getCollection, getEntry } from "astro:content"


export const formatTitle = async (postId: string): Promise<string> => {
	let post = await getEntry("blog", postId);

	return post?.data.displayName ?? post?.filePath?.split("/").at(-1)?.replaceAll("%20", " ") ?? ""
}

export const findPostsWithTag = async (tag: string): Promise<string[]> => {
	let posts = await getCollection("blog", (post) => {
		return post.data.tags?.includes(tag)
	});
	return posts.map(p => p.id);
}
