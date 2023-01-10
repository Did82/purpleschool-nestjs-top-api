import {
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthDto) {
		const userExists = await this.authService.findUser(dto.email);
		if (userExists) {
			throw new ConflictException('User already exists');
		} else {
			return await this.authService.createUser(dto);
		}
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		const { email, password } = dto;
		const user = await this.authService.validateUser(email, password);
		return this.authService.login(user.id, user.email);
	}
}
