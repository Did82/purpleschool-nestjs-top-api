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
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IdValidation } from '../validation/id-validation';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return await this.productService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param() params: IdValidation) {
		const product = await this.productService.findById(params.id);
		if (!product) {
			throw new NotFoundException('Product not found');
		}
		return product;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param() params: IdValidation) {
		try {
			return await this.productService.delete(params.id);
		} catch (error) {
			throw new NotFoundException('Product not found');
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param() params: IdValidation, @Body() dto: CreateProductDto) {
		try {
			return await this.productService.update(params.id, dto);
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
