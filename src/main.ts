import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);
	const configService = app.get(ConfigService);
	const logger = new Logger(AppModule.name, { timestamp: true });
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api');
	const port = configService.get<number>('PORT') || 3001;
	await app.listen(port);
	logger.log(`🚀 Application listening on port ${port}`);
}
bootstrap();
