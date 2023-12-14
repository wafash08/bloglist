import { Router } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.js';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body;

	const SALT_ROUNDS = 10;
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

	const user = new User({ name, username, passwordHash });

	const savedUser = await user.save();
	response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
	const users = await User.find({});

	response.status(200).json(users);
});

usersRouter.delete('/:id', async (request, response) => {
	await User.findByIdAndDelete(request.params.id);

	response.status(204).end();
});

export default usersRouter;
