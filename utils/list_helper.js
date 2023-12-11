/**
 *
 * @param {{content: string, author: string, url: string, likes: number}[]} blogs
 * @returns {number}
 */
export function dummy(blogs) {
	return 1;
}
/**
 *
 * @param {{content: string, author: string, url: string, likes: number}[]} blogs
 * @returns {number}
 */
export function totalLikes(blogs) {
	return blogs.reduce((sum, blog) => {
		// console.log('current blog likes >> ', blog.likes);
		return sum + blog.likes;
	}, 0);
}
