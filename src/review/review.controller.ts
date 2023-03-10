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
import { IdValidation, ProductIdValidation } from '../validation/id-validation';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message =
			`Имя: ${dto.name}\n` +
			`Заголовок: ${dto.title}\n` +
			`Описание: ${dto.description}\n` +
			`Рейтинг: ${dto.rating}\n` +
			`ID Продукта: ${dto.productId}`;
		await this.telegramService.sendMessage(message);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param() params: IdValidation) {
		try {
			await this.reviewService.delete(params.id);
		} catch (e) {
			throw new NotFoundException('Review not found');
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(@Param() params: ProductIdValidation) {
		return this.reviewService.findByProductId(params.productId);
	}
}
