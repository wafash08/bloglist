export const BLOGS = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		__v: 0,
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0,
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		__v: 0,
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		__v: 0,
	},
	{
		_id: '5a422ba71b54a676234d17fb',
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		__v: 0,
	},
	{
		_id: '5a422bc61b54a676234d17fc',
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
		__v: 0,
	},
];

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

/**
 *
 * @param {{title: string, author: string, url: string, likes: number}[]} blogs
 * @returns {{ author: string, blogs: 3}}
 */
export function mostBlogs(blogs) {
	const authorsAndBlogs = {};
	for (const blog of blogs) {
		if (authorsAndBlogs[blog.author] === undefined) {
			authorsAndBlogs[blog.author] = { author: blog.author, blogs: 1 };
		} else {
			authorsAndBlogs[blog.author] = {
				...authorsAndBlogs[blog.author],
				blogs: authorsAndBlogs[blog.author].blogs + 1,
			};
		}
	}
	const sortByBlogs = Object.values(authorsAndBlogs).sort((a, b) => {
		// descending
		return b.blogs - a.blogs;
	});
	return sortByBlogs[0];
}

console.log(mostBlogs(BLOGS));
