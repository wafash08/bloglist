import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { INITIAL_USERS, usersInDB } from './test_helper.js';
import { User } from '../models/user.js';

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});
	await User.insertMany(INITIAL_USERS);
});

describe('user creation', () => {
	test('does not create new user if the username or password is invalid', async () => {
		const newUser = {
			name: 'Super John',
			username: 'jo',
			password: '12',
		};

		const usersBeforeAddition = await usersInDB();

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const usersAfterAddition = await usersInDB();

		expect(usersAfterAddition).not.toContain(newUser.username);
		expect(usersBeforeAddition).toHaveLength(usersAfterAddition.length);
	});

	test('fails with proper error message and status code', async () => {
		const newUser = {
			name: 'Super John',
			username: 'jo',
			password: '12',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toBe(
			'username or password must be more than 3 characters'
		);
		expect(result.error.status).toBe(400);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
