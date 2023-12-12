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

afterAll(async () => {
	await mongoose.connection.close();
});
