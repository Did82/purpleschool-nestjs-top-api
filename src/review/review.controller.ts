import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		try {
			await this.reviewService.delete(id);
		} catch (e) {
			throw new NotFoundException('Review not found');
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(@Param('productId') productId: string) {
		return this.reviewService.findByProductId(productId);
	}
}
