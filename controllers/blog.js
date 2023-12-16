import express from 'express';
import { Blog } from '../models/blog.js';
import { User } from '../models/user.js';
import { userExtractor } from '../utils/middleware.js';

const { Router } = express;
const blogRouter = Router();

blogRouter.get('/', async (request, response, next) => {
	try {
		const blogs = await Blog.find({}).populate('user', {
			username: 1,
			name: 1,
		});
		response.json({ data: blogs });
	} catch (error) {
		next(error);
	}
});

blogRouter.get('/:id', async (request, response, next) => {
	try {
		const blog = await Blog.findById(request.params.id).populate('user', {
			username: 1,
			name: 1,
		});
		response.json({ data: blog });
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/', userExtractor, async (request, response, next) => {
	try {
		const { title, author, likes, url } = request.body;
		const authorizedUser = request.user;

		if (!authorizedUser.id) {
			return response.status(401).json({ error: 'token invalid' });
		}

		if (title === undefined || url === undefined) {
			return response
				.status(400)
				.json({ error: `Field title or url does have to be filled` });
		}

		const user = await User.findById(authorizedUser.id);
		const blog = new Blog({
			author,
			likes: likes ?? 0,
			title,
			url,
			user: user._id,
		});
		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		response.status(201).json({ data: savedBlog });
	} catch (error) {
		next(error);
	}
});

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
	try {
		const blog = await Blog.findById(request.params.id);
		const authorizedUser = request.user;

		if (!blog) {
			return response
				.status(404)
				.json({ error: 'Blog you are going to delete is not found' });
		}

		if (blog.user.toString() !== authorizedUser.id) {
			return response.status(401).json({
				error: 'You are not authorized for deleting this blog',
			});
		}

		await Blog.findByIdAndDelete(request.params.id);
		response.status(204).end();
	} catch (error) {
		next(error);
	}
});

blogRouter.put('/:id', async (request, response, next) => {
	try {
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
		response.json({ data: updatedBlog });
	} catch (error) {
		next(error);
	}
});

export default blogRouter;
