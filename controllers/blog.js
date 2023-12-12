import { Router } from 'express';
import { Blog } from '../models/blog.js';

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
	const { title, author, likes, url } = request.body;
	const blog = new Blog({
		author,
		likes: likes ?? 0,
		title,
		url,
	});

	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
});

export default blogRouter;
