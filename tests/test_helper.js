import { Blog } from '../models/blog';

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
