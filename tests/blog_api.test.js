import supertest from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { Blog } from '../models/blog.js';
import { INITIAL_BLOGS } from './test_helper.js';

const api = supertest(app);

beforeAll(async () => {
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

afterAll(async () => {
	await mongoose.connection.close();
});
