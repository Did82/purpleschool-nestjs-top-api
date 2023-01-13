import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateProductDto): Promise<Product> {
		return await this.prisma.product.create({
			data: {
				...dto,
			},
		});
	}

	async findById(id: string) {
		return await this.prisma.product.findFirst({
			where: {
				id,
			},
			include: {
				reviews: true,
			},
		});
	}

	async delete(id: string): Promise<Product> {
		return await this.prisma.product.delete({
			where: {
				id,
			},
		});
	}

	async update(id: string, data: CreateProductDto): Promise<Product> {
		return await this.prisma.product.update({
			where: {
				id,
			},
			data,
		});
	}

	async findMany(dto: FindProductDto) {
		const agregateAvg = await this.prisma.review.aggregate({
			where: {
				product: {
					categories: {
						has: dto.category,
					},
				},
			},
			_avg: {
				rating: true,
			},
		});

		const agregateCount = await this.prisma.review.aggregate({
			where: {
				product: {
					categories: {
						has: dto.category,
					},
				},
			},
			_count: {
				rating: true,
			},
		});

		const products = await this.prisma.product.findMany({
			where: {
				categories: {
					has: dto.category,
				},
			},
			include: {
				reviews: {
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
			orderBy: {
				id: 'asc',
			},
			take: dto.limit,
		});

		const productWithAvgAndCount = products.map((product) => {
			return {
				...product,
				reviewAvg: agregateAvg._avg.rating,
				reviewCount: agregateCount._count.rating,
			};
		});

		return productWithAvgAndCount;
	}
}
