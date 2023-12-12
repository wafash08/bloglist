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

test('succeeds adding new blog', async () => {
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

afterAll(async () => {
	await mongoose.connection.close();
});
