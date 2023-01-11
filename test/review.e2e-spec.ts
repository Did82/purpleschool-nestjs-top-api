import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ObjectId } from 'bson';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';

const productId = new ObjectId().toHexString();
const fakeId = new ObjectId().toHexString();
const wrongId = 'wrongId';

const testUser = {
	email: 'met9129@gmail.com',
	password: '118649qwe',
};

const testReview: CreateReviewDto = {
	productId: productId,
	name: 'Test review',
	title: 'Test title',
	description: 'Test description',
	rating: 5,
};

describe('ReviewController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		const res = await request(app.getHttpServer())
			.post('/auth/login')
			.send(testUser);
		token = res.body.access_token;
	});

	it('/review/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testReview)
			.expect(201)
			.then((res) => {
				createdId = res.body.id;
				expect(createdId).toBeDefined();
				expect(res.body).toEqual(expect.objectContaining(testReview));
			});
	});

	it('/review/create (POST) - fail', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send({
				...testReview,
				rating: 6,
			})
			.expect(400, {
				statusCode: 400,
				message: ['rating must not be greater than 5'],
				error: 'Bad Request',
			});
	});

	it('/review/byProduct/:productId (GET)', async () => {
		return request(app.getHttpServer())
			.get(`/review/byProduct/${productId}`)
			.expect(200)
			.then((res) => {
				expect(res.body.length).toBe(1);
				expect(res.body[0]).toEqual(
					expect.objectContaining(testReview),
				);
			});
	});

	it('/review/byProduct/:productId (GET) - fakeId', async () => {
		return request(app.getHttpServer())
			.get(`/review/byProduct/${fakeId}`)
			.expect(200)
			.then((res) => {
				expect(res.body.length).toBe(0);
			});
	});

	it('/review/byProduct/:productId (GET) - wrongId', async () => {
		return request(app.getHttpServer())
			.get(`/review/byProduct/${wrongId}`)
			.expect(400, {
				statusCode: 400,
				message: ['productId must be a mongodb id'],
				error: 'Bad Request',
			});
	});

	it('/review/:id (DELETE) - fakeId', async () => {
		return request(app.getHttpServer())
			.delete(`/review/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404, {
				statusCode: 404,
				message: 'Review not found',
				error: 'Not Found',
			});
	});

	it('/review/:id (DELETE)', async () => {
		return request(app.getHttpServer())
			.delete(`/review/${createdId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
});
