import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('review')
export class ReviewController {
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
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
