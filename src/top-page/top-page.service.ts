import { Injectable } from '@nestjs/common';
import { TopLevelCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateTopPageDto) {
		return await this.prisma.topPage.create({
			data: {
				...dto,
			},
			include: {
				hh: true,
				advantages: true,
			},
		});
	}

	async findAll() {
		return await this.prisma.topPage.findMany({
			include: {
				hh: true,
				advantages: true,
			},
		});
	}

	async findById(id: string) {
		return await this.prisma.topPage.findFirst({
			where: { id },
			include: {
				hh: true,
				advantages: true,
			},
		});
	}

	async findByAlias(alias: string) {
		return await this.prisma.topPage.findFirst({
			where: { alias },
			include: {
				hh: true,
				advantages: true,
			},
		});
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		const groupTopPagesBySecondCategory = await this.prisma.topPage.groupBy(
			{
				by: ['secondCategory'],
				where: { firstCategory },
			},
		);

		const topPages = await this.prisma.topPage.findMany({
			where: {
				firstCategory,
			},
			take: 1,
			orderBy: {
				createdAt: 'asc',
			},
			select: {
				alias: true,
				title: true,
			},
		});

		const result: Array<{
			category: TopLevelCategory;
			pages: Array<{ alias: string; title: string }>;
		}> = [
			{
				category: firstCategory,
				pages: topPages,
			},
		];

		return result;
	}

	async update(id: string, dto: CreateTopPageDto) {
		return await this.prisma.topPage.update({
			where: { id },
			data: {
				...dto,
			},
			include: {
				hh: true,
				advantages: true,
			},
		});
	}

	async delete(id: string) {
		return await this.prisma.topPage.delete({
			where: { id },
		});
	}
}
