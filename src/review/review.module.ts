import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
	imports: [TelegramModule],
	controllers: [ReviewController],
	providers: [ReviewService],
})
export class ReviewModule {}
