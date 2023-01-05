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
import { FindProductDto } from './dto/find-product.dto';

@Controller('product')
export class ProductController {
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
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
	async patch(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return 'patch';
	}

	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return 'find';
	}
}
