import supertest from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { Blog } from '../models/blog.js';
import { INITIAL_BLOGS, blogsInDB } from './test_helper.js';

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(INITIAL_BLOGS);
});

test('blogs returned as json', async () => {
	const result = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);

	expect(result.body).toHaveLength(2);
});

test('of unique identifier of the blog is defined as id', async () => {
	const result = await api.get('/api/blogs');
	result.body.forEach(blog => {
		expect(blog.id).toBeDefined();
		expect(blog._id).toBeUndefined();
		expect(blog.__v).toBeUndefined();
	});
});

describe('addition of a new blog list', () => {
	test('succeeds adding a new blog', async () => {
		const newBlog = {
			author: 'Josh Comeau',
			likes: 104416,
			title: 'The End of Front-End Development',
			url: 'https://www.joshwcomeau.com/blog/the-end-of-frontend-development/',
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogs = await blogsInDB();
		expect(blogs).toHaveLength(INITIAL_BLOGS.length + 1);

		const titles = blogs.map(b => b.title);
		expect(titles).toContain(newBlog.title);
	});

	test('succeeds with default likes to 0', async () => {
		const newBlog = {
			author: 'Josh Comeau',
			title: 'The End of Front-End Development',
			url: 'https://www.joshwcomeau.com/blog/the-end-of-frontend-development/',
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);
		const blogs = await blogsInDB();
		const likes = blogs.map(b => b.likes);
		expect(likes).toContain(0);
	});
});

test('succeeds with status 204', async () => {
	const blogs = await blogsInDB();
	const blogToDelete = blogs[0];

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

	const blogsAfterDeletion = await blogsInDB();
	expect(blogsAfterDeletion).toHaveLength(INITIAL_BLOGS.length - 1);

	const titles = blogsAfterDeletion.map(b => b.title);
	expect(titles).not.toContain(blogToDelete.title);
});

test('succeeds updating blog', async () => {
	const blogs = await blogsInDB();
	const blogToUpdate = blogs[0];
	const updatedBlog = {
		...blogToUpdate,
		likes: 30000,
	};

	await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog);

	const blogAfterUpdate = await blogsInDB();
	expect(blogAfterUpdate).toHaveLength(INITIAL_BLOGS.length);

	const beforeUpdateLikes = blogs.map(b => b.likes);
	const afterUpdateLikes = blogAfterUpdate.map(b => b.likes);

	console.log('beforeUpdateLikes >> ', beforeUpdateLikes);
	console.log('afterUpdateLikes >> ', afterUpdateLikes);

	expect(beforeUpdateLikes).not.toContain(afterUpdateLikes);
});

afterAll(async () => {
	await mongoose.connection.close();
});
