import { Router } from 'express';
import { Blog } from '../models/blog.js';

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
	const { title, author, likes, url } = request.body;

	if (title === undefined || url === undefined) {
		return response
			.status(400)
			.json({ error: `Field title or url does have to be filled` });
	}

	const blog = new Blog({
		author,
		likes: likes ?? 0,
		title,
		url,
	});

	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
	const id = request.params.id;
	const { author, likes, title, url } = request.body;

	const newBlog = {
		author,
		likes,
		title,
		url,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, {
		new: true,
	});
	response.json(updatedBlog);
});

export default blogRouter;
