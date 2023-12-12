import { Router } from 'express';
import { Blog } from '../models/blog.js';

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body);

	const savedBlog = blog.save();
	response.status(201).json(savedBlog);
});

export default blogRouter;
