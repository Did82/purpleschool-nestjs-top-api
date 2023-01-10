import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const logger = new Logger(AppModule.name, { timestamp: true });
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api');
	const port = configService.get<number>('PORT') || 3001;
	await app.listen(port);
	logger.log(`🚀 Application listening on port ${port}`);
}
bootstrap();
