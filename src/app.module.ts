import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './files/files.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewModule,
		PrismaModule,
		FilesModule,
		SitemapModule,
		TelegramModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
