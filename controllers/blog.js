import { Router } from 'express';
import { Blog } from '../models/blog.js';
import { User } from '../models/user.js';

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
	});
	response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
	const { title, author, likes, url, userID } = request.body;

	if (title === undefined || url === undefined) {
		return response
			.status(400)
			.json({ error: `Field title or url does have to be filled` });
	}

	const user = await User.findById(userID);

	const blog = new Blog({
		author,
		likes: likes ?? 0,
		title,
		url,
		user: user.id,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();
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
