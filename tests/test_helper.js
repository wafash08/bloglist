import { Blog } from '../models/blog.js';
import { User } from '../models/user.js';

export const INITIAL_BLOGS = [
	{
		title: 'An Interactive Guide to CSS Grid',
		author: 'Josh Comeau',
		url: 'https://www.joshwcomeau.com/css/interactive-guide-to-grid/',
		likes: 28403,
	},
	{
		title: 'Accessible, Typesafe, Progressively Enhanced Modern Web Forms',
		author: 'Kent C. Dodds',
		url: 'https://www.epicweb.dev/accessible-typesafe-progressively-enhanced-modern-web-forms',
		likes: 2000,
	},
];

export async function blogsInDB() {
	const blogs = await Blog.find({});
	return blogs.map(b => b.toJSON());
}

export const INITIAL_USERS = [
	{
		name: 'Lulu',
		username: 'lulu',
		password: '1234',
	},
	{
		name: 'Wafi',
		username: 'wafi',
		password: '1234',
	},
];

export async function usersInDB() {
	const users = await User.find({});
	return users.map(u => u.toJSON());
}
