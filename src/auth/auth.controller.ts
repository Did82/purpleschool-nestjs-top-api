import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	@Post('register')
	async register(@Body() dto: Prisma.UserCreateInput) {
		return 'register';
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: Prisma.UserCreateInput) {
		return 'login';
	}
}
