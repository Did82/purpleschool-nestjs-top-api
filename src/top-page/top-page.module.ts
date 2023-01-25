import { Module } from '@nestjs/common';
import { HhModule } from '../hh/hh.module';
import { TopPageController } from './top-page.controller';
import { TopPageService } from './top-page.service';

@Module({
	imports: [HhModule],
	controllers: [TopPageController],
	providers: [TopPageService],
	exports: [TopPageService],
})
export class TopPageModule {}
