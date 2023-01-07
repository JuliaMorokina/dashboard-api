import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('users e2e', () => {
	it('register - error', async () => {
		const res = await request(application.app).post('/users/registration').send({
			email: 'v@v.ru',
			password: '123',
		});
		expect(res.statusCode).toBe(422);
	});

	it('login - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'v@v.ru',
			password: '123',
		});
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('login - error', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'v@v.ru',
			password: '1',
		});
		expect(res.statusCode).toBe(401);
	});

	it('info - success', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'v@v.ru',
			password: '123',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('v@v.ru');
	});

	it('info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1}`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
