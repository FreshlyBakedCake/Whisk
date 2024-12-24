import { getEntry } from "astro:content"



export const formatTitle = async (postId: string): Promise<string> => {
	let post = await getEntry("blog", postId);

	return post?.data.displayName ?? post?.filePath?.split("/").at(-1)?.replaceAll("%20", " ") ?? ""
}
