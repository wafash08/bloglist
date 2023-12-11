import {
	dummy,
	favoriteBlog,
	mostBlogs,
	totalLikes,
	BLOGS,
	mostLikes,
} from '../utils/list_helper';

test('dummy return one', () => {
	const blogs = [];
	const result = dummy(blogs);
	expect(result).toBe(1);
});

const listWithOneBlog = [
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0,
	},
];

describe('total likes', () => {
	test('of empty list is zero', () => {
		const result = totalLikes([]);
		expect(result).toBe(0);
	});

	test('when list has only one blog, equals the likes of that', () => {
		const result = totalLikes(listWithOneBlog);
		expect(result).toBe(listWithOneBlog[0].likes);
	});

	test('of a bigger list is calculated right', () => {
		const result = totalLikes(BLOGS);
		expect(result).toBe(36);
	});
});

describe('favorite blog', () => {
	test('of favorite blog with most likes', () => {
		const blogWithMostLikes = {
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			likes: 12,
		};
		const result = favoriteBlog(BLOGS);
		console.log('result >> ', result);
		expect(result).toEqual(blogWithMostLikes);
	});
});

describe('most blogs', () => {
	test('of author with most blogs', () => {
		const result = mostBlogs(BLOGS);
		expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 });
	});
});

describe('most likes', () => {
	test('of author with most likes', () => {
		const result = mostLikes(BLOGS);
		expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 });
	});
});
