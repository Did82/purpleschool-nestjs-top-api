import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return await this.productService.create(dto);
	}

	@Get(':id')
	async get(@Param('id') id: string) {
		const product = await this.productService.findById(id);
		if (!product) {
			throw new NotFoundException('Product not found');
		}
		return product;
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		try {
			return await this.productService.delete(id);
		} catch (error) {
			throw new NotFoundException('Product not found');
		}
	}

	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: CreateProductDto) {
		try {
			return await this.productService.update(id, dto);
		} catch (error) {
			throw new NotFoundException('Product not found');
		}
	}

	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return await this.productService.findMany(dto);
	}
}
