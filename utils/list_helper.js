/**
 *
 * @param {{title: string, author: string, url: string, likes: number}[]} blogs
 * @returns {number}
 */
export function dummy(blogs) {
	return 1;
}
/**
 *
 * @param {{title: string, author: string, url: string, likes: number}[]} blogs
 * @returns {number}
 */
export function totalLikes(blogs) {
	return blogs.reduce((sum, blog) => {
		// console.log('current blog likes >> ', blog.likes);
		return sum + blog.likes;
	}, 0);
}
/**
 *
 * @param {{title: string, author: string, url: string, likes: number}[]} blogs
 * @returns {{title: string, author: string, likes: number}}
 */
export function favoriteBlog(blogs) {
	const blogWithMostLikes = blogs.sort((a, b) => {
		const likesOfA = a.likes;
		const likesOfB = b.likes;
		// descending
		return likesOfB - likesOfA;
	});

	return {
		title: blogWithMostLikes[0].title,
		author: blogWithMostLikes[0].author,
		likes: blogWithMostLikes[0].likes,
	};
}
