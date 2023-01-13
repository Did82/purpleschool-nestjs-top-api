import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ReviewService, PrismaService],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
