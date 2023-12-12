import 'dotenv/config';

export const PORT = process.env.PORT;
export const MONGODB_URI =
	process.env.NODE_ENV === 'test'
		? process.env.MONGODB_URI_TEST
		: process.env.MONGODB_URI;
