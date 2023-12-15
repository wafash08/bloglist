import { Router } from 'express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const loginRouter = Router();

loginRouter.post('/', async (request, response, next) => {
	try {
		const { username, password } = request.body;
		const user = await User.findOne({ username });

		const isPasswordCorrect =
			user === null
				? false
				: await bcrypt.compare(password, user.passwordHash);

		if (!(user && isPasswordCorrect)) {
			return response.status(401).json({
				error: 'username or password is wrong',
			});
		}

		const userForToken = {
			username: user.username,
			id: user._id,
		};

		const token = jwt.sign(userForToken, process.env.SECRET);

		response.status(200).json({
			data: { token, username: user.username, name: user.name },
		});
	} catch (error) {
		next(error);
	}
});

export default loginRouter;
