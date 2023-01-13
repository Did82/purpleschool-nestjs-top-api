import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const testUser = {
	email: 'met9129@gmail.com',
	password: '118649qwe',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(testUser)
			.expect(200)
			.then((res) => {
				expect(res.body).toEqual(
					expect.objectContaining({
						access_token: expect.any(String),
					}),
				);
			});
	});

	it('/auth/login (POST) - wrong password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				...testUser,
				password: 'wrong password',
			})
			.expect(401)
			.then((res) => {
				expect(res.body).toEqual(
					expect.objectContaining({
						statusCode: 401,
						message: 'Invalid password',
						error: 'Unauthorized',
					}),
				);
			});
	});

	it('/auth/login (POST) - wrong email', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				...testUser,
				email: 'met@gmail.com',
			})
			.expect(404)
			.then((res) => {
				expect(res.body).toEqual(
					expect.objectContaining({
						statusCode: 404,
						message: 'User not found',
						error: 'Not Found',
					}),
				);
			});
	});
});
