import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateReviewDto): Promise<Review> {
		return this.prisma.review.create({
			data: {
				...dto,
			},
		});
	}

	async delete(id: string): Promise<Review> {
		return this.prisma.review.delete({
			where: {
				id,
			},
		});
	}

	async findByProductId(productId: string): Promise<Review[]> {
		return this.prisma.review.findMany({
			where: {
				productId,
			},
		});
	}
}
