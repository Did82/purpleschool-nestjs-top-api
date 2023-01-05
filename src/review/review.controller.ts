import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Controller('review')
export class ReviewController {
	@Post('create')
	async create(@Body() dto: Prisma.ReviewCreateInput) {
		return 'create';
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return 'delete';
	}

	@Get('byProduct/:productId')
	async getByProduct(@Param('productId') productId: string) {
		return 'byProduct';
	}
}
