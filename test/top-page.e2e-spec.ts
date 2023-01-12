import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ObjectId } from 'bson';

const testTopPage = {
	firstCategory: 'Courses',
	secondCategory: 'secondCategory',
	alias: 'alias',
	title: 'title',
	metaTitle: 'metaTitle',
	metaDescription: 'metaDescription',
	category: 'category',
	// hh: {
	// 	count: 1,
	// 	juniorSalary: 1,
	// 	middleSalary: 1,
	// 	seniorSalary: 1,
	// 	updatedAt: new Date(),
	// },
	advantages: [
		{
			title: 'title',
			description: 'description',
		},
	],
	seoText: 'seoText',
	tagsTitle: 'tagsTitle',
	tags: ['tag1', 'tag2'],
};

const testUser = {
	email: 'met9129@gmail.com',
	password: '118649qwe',
};

const wrongId = 'wrongId';
const fakeId = new ObjectId().toHexString();

describe('TopPageController (e2e)', () => {
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

	it('/top-page/create (POST) - success', async () => {
		const res = await request(app.getHttpServer())
			.post('/top-page/create')
			.set('Authorization', `Bearer ${token}`)
			.send(testTopPage);
		createdId = res.body.id;
		expect(res.status).toBe(201);
		expect(res.body).toEqual(expect.objectContaining(testTopPage));
	});

	it('/top-page/create (POST) - fail', async () => {
		const res = await request(app.getHttpServer())
			.post('/top-page/create')
			.set('Authorization', `Bearer ${token}`)
			.send({ ...testTopPage, firstCategory: 'wrong' });
		expect(res.status).toBe(400);
	});

	it('/top-page/byId/:id (GET) - success', async () => {
		const res = await request(app.getHttpServer())
			.get(`/top-page/${createdId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
		expect(res.body).toEqual(expect.objectContaining(testTopPage));
	});

	it('/top-page/byId/:id (GET) - fail', async () => {
		const res = await request(app.getHttpServer())
			.get(`/top-page/${wrongId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(400);
	});

	it('/top-page/byId/:id (GET) - fail', async () => {
		const res = await request(app.getHttpServer())
			.get(`/top-page/${fakeId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(404);
	});

	it('/top-page/byAlias/:alias (GET) - success', async () => {
		const res = await request(app.getHttpServer())
			.get(`/top-page/byAlias/${testTopPage.alias}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
		expect(res.body).toEqual(expect.objectContaining(testTopPage));
	});

	it('/top-page/byAlias/:alias (GET) - fail', async () => {
		const res = await request(app.getHttpServer())
			.get(`/top-page/byAlias/${wrongId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(404);
	});

	it('/top-page/byAlias/:alias (GET) - fail', async () => {
		const res = await request(app.getHttpServer())
			.get(`/top-page/byAlias/${fakeId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(404);
	});

	it('/top-page/find (POST) - success', async () => {
		const res = await request(app.getHttpServer())
			.post('/top-page/find')
			.set('Authorization', `Bearer ${token}`)
			.send({ firstCategory: testTopPage.firstCategory });
		expect(res.status).toBe(200);
		expect(res.body).toEqual([
			{
				category: testTopPage.firstCategory,
				pages: [
					{
						alias: testTopPage.alias,
						title: testTopPage.title,
					},
				],
			},
		]);
	});

	it('/top-page/find (POST) - fail', async () => {
		const res = await request(app.getHttpServer())
			.post('/top-page/find')
			.set('Authorization', `Bearer ${token}`)
			.send({ firstCategory: 'wrong' });
		expect(res.status).toBe(400);
	});

	it('/top-page/byId/:id (PATCH) - success', async () => {
		const res = await request(app.getHttpServer())
			.patch(`/top-page/${createdId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				...testTopPage,
				title: 'new title',
			});
		expect(res.status).toBe(200);
		expect(res.body).toEqual(
			expect.objectContaining({
				...testTopPage,
				id: createdId,
				title: 'new title',
			}),
		);
	});

	it('/top-page/byId/:id (PATCH) - fail', async () => {
		const res = await request(app.getHttpServer())
			.patch(`/top-page/${wrongId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				...testTopPage,
				title: 'new title',
			});
		expect(res.status).toBe(400);
	});

	it('/top-page/byId/:id (PATCH) - fail', async () => {
		const res = await request(app.getHttpServer())
			.patch(`/top-page/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				...testTopPage,
				title: 'new title',
			});
		expect(res.status).toBe(404);
	});

	it('/top-page/byId/:id (DELETE) - success', async () => {
		const res = await request(app.getHttpServer())
			.delete(`/top-page/${createdId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
	});

	it('/top-page/byId/:id (DELETE) - fail', async () => {
		const res = await request(app.getHttpServer())
			.delete(`/top-page/${wrongId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(400);
	});

	it('/top-page/byId/:id (DELETE) - fail', async () => {
		const res = await request(app.getHttpServer())
			.delete(`/top-page/${fakeId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(404);
	});
});
