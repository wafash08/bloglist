import supertest from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import app from '../app.js';
import { Blog } from '../models/blog.js';
import { INITIAL_BLOGS, blogsInDB } from './test_helper.js';
import { User } from '../models/user.js';

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});
	const SALT = 10;
	const passwordHash = await bcrypt.hash('super123', SALT);
	const user = {
		blogs: [],
		username: 'super',
		name: 'Super Test',
		passwordHash,
	};
	await User.create(user);
});

beforeEach(async () => {
	await Blog.deleteMany({});
	const users = await User.find({});
	const user = users[0];
	const blogs = INITIAL_BLOGS.map(
		blog =>
			new Blog({
				author: blog.author,
				likes: blog.likes ? blog.likes : 0,
				title: blog.title,
				url: blog.url,
				user: user._id,
			})
	);

	await Promise.all(
		blogs.map(b => {
			b.save();
			user.blogs = user.blogs.concat(b._id);
		})
	);
	await user.save();
});

test('blogs returned as json', async () => {
	const result = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);

	expect(result.body.data).toHaveLength(2);
});

test('of unique identifier of the blog is defined as id', async () => {
	const result = await api.get('/api/blogs');
	result.body.data.forEach(blog => {
		expect(blog.id).toBeDefined();
		expect(blog._id).toBeUndefined();
		expect(blog.__v).toBeUndefined();
	});
});

describe('addition of a new blog list', () => {
	test('succeeds adding a new blog', async () => {
		const user = await api
			.post('/api/login')
			.send({ username: 'super', password: 'super123' });

		const token = user.body.data.token;

		const newBlog = {
			author: 'Josh Comeau',
			likes: 104416,
			title: 'The End of Front-End Development',
			url: 'https://www.joshwcomeau.com/blog/the-end-of-frontend-development/',
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogs = await blogsInDB();
		expect(blogs).toHaveLength(INITIAL_BLOGS.length + 1);

		const titles = blogs.map(b => b.title);
		expect(titles).toContain(newBlog.title);
	});

	test('succeeds with default likes to 0', async () => {
		const user = await api
			.post('/api/login')
			.send({ username: 'super', password: 'super123' });

		const token = user.body.data.token;

		const newBlog = {
			author: 'Josh Comeau',
			title: 'The End of Front-End Development',
			url: 'https://www.joshwcomeau.com/blog/the-end-of-frontend-development/',
		};
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogs = await blogsInDB();
		const updatedBlog = blogs.find(b => b.title === newBlog.title);
		expect(updatedBlog.likes).toBe(0);
	});

	test('fails if the unauthorized user creates blog', async () => {
		const newBlog = {
			author: 'Josh Comeau',
			title: 'The End of Front-End Development',
			url: 'https://www.joshwcomeau.com/blog/the-end-of-frontend-development/',
		};
		const result = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(result.statusCode).toBe(401);
		expect(result.body.error).toBe('invalid token');
	});
});

test('of delete succeeds with status 204', async () => {
	const user = await api
		.post('/api/login')
		.send({ username: 'super', password: 'super123' });

	const token = user.body.data.token;
	const blogs = await blogsInDB();
	const blogToDelete = blogs[0];

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(204);

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

	expect(beforeUpdateLikes).not.toContain(afterUpdateLikes);
});

afterAll(async () => {
	await mongoose.connection.close();
});
