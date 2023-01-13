import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { compare, hash } from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto): Promise<Pick<User, 'id' | 'email'>> {
		const salt = 10;
		return await this.prisma.user.create({
			data: {
				email: dto.email,
				passwordHash: await hash(dto.password, salt),
			},
			select: {
				id: true,
				email: true,
			},
		});
	}

	async findUser(email: string) {
		return await this.prisma.user.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				email: true,
				passwordHash: true,
			},
		});
	}

	async validateUser(email: string, password: string) {
		const user = await this.findUser(email);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const isPasswordValid = await compare(password, user.passwordHash);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid password');
		}
		const { passwordHash, ...result } = user;
		return result;
	}

	async login(id: string, email: string): Promise<{ access_token: string }> {
		const payload = { email, sub: id };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
