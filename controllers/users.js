import { Router } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.js';

const usersRouter = Router();

usersRouter.post('/', async (request, response, next) => {
	try {
		const { username, name, password } = request.body;

		if (username.length <= 3 || password <= 3) {
			return response.status(400).json({
				error: 'username or password must be more than 3 characters',
			});
		}

		const SALT_ROUNDS = 10;
		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

		const user = new User({ name, username, passwordHash });

		const savedUser = await user.save();
		response.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
});

usersRouter.get('/', async (request, response, next) => {
	try {
		const users = await User.find({});

		response.status(200).json(users);
	} catch (error) {
		next(error);
	}
});

usersRouter.delete('/:id', async (request, response, next) => {
	try {
		await User.findByIdAndDelete(request.params.id);

		response.status(204).end();
	} catch (error) {
		next(error);
	}
});

export default usersRouter;
