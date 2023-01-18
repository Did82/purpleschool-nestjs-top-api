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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
