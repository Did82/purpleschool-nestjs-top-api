import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ObjectId } from 'bson';

const testProduct = {
	image: 'https://via.placeholder.com/200x150',
	title: 'Test product',
	link: 'https://www.wildberries.ru/catalog/13725354/detail.aspx',
	initialRating: 5,
	price: 1000,
	oldPrice: 2000,
	credit: 12,
	description: 'Test description',
	advantages: 'Test advantages',
	disAdvantages: 'Test disAdvantages',
	categories: ['Test category'],
	tags: ['Test tag'],
	characteristics: [
		{
			name: 'Test name',
			value: 'Test value',
		},
		{
			name: 'Test name 2',
			value: 'Test value 2',
		},
	],
};

const testUser = {
	email: 'met9129@gmail.com',
	password: '118649qwe',
};

const wrongId = 'wrongId';
const fakeId = new ObjectId().toHexString();

describe('ProductController (e2e)', () => {
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

	it('/product/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/product/create')
			.set('Authorization', `Bearer ${token}`)
			.send(testProduct)
			.expect(201)
			.then((res) => {
				createdId = res.body.id;
				expect(createdId).toBeDefined();
				expect(res.body).toEqual(expect.objectContaining(testProduct));
			});
	});

	it('/product/create (POST) - fail', async () => {
		return request(app.getHttpServer())
			.post('/product/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				...testProduct,
				price: 'wrong price',
			})
			.expect(400);
	});

	it('/product/:id (GET) - success', async () => {
		return request(app.getHttpServer())
			.get(`/product/${createdId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then((res) => {
				expect(res.body).toEqual(expect.objectContaining(testProduct));
			});
	});

	it('/product/:id (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get(`/product/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});

	it('/product/:id (DELETE) - success', async () => {
		return request(app.getHttpServer())
			.delete(`/product/${createdId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then((res) => {
				expect(res.body).toEqual(expect.objectContaining(testProduct));
			});
	});

	it('/product/:id (DELETE) - fail', async () => {
		return request(app.getHttpServer())
			.delete(`/product/${wrongId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
});
