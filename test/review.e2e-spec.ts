import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ObjectId } from 'bson';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';

const productId = new ObjectId().toHexString();
const fakeId = new ObjectId().toHexString();

const testReview: CreateReviewDto = {
	productId: productId,
	name: 'Test review',
	title: 'Test title',
	description: 'Test description',
	rating: 5,
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/review/create (POST)', async () => {
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

	it('/review/:id (DELETE) - fakeId', async () => {
		return request(app.getHttpServer())
			.delete(`/review/${fakeId}`)
			.expect(404, {
				statusCode: 404,
				message: 'Review not found',
				error: 'Not Found',
			});
	});

	it('/review/:id (DELETE)', async () => {
		return request(app.getHttpServer())
			.delete(`/review/${createdId}`)
			.expect(200);
	});
});
