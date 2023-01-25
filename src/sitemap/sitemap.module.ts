import { Module } from '@nestjs/common';
import { TopPageModule } from '../top-page/top-page.module';
import { SitemapController } from './sitemap.controller';

@Module({
	imports: [TopPageModule],
	controllers: [SitemapController],
})
export class SitemapModule {}
