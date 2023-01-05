import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Controller('top-page')
export class TopPageController {
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return 'create';
	}

	@Get(':id')
	async get(@Param('id') id: string) {
		return 'get';
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return 'delete';
	}

	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: CreateTopPageDto) {
		return 'patch';
	}

	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return 'find';
	}
}
