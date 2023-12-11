import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import blogRouter from './controllers/blog.js';
import { MONGODB_URI } from './utils/config.js';

mongoose.connect(MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());
morgan.token('blog', (req, res) => {
	return JSON.stringify(req.body);
});
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :blog'
	)
);

app.use('/api/blogs', blogRouter);

export default app;
