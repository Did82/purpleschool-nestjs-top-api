import { Type } from 'class-transformer';
import {
	IsArray,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

class ProductCharacteristicDto {
	@IsString()
	name: string;

	@IsString()
	value: string;
}

export class CreateProductDto {
	@IsString()
	image: string;

	@IsString()
	title: string;

	@IsString()
	link: string;

	@IsInt()
	initialRating: number;

	@IsNumber()
	price: number;

	@IsNumber()
	@IsOptional()
	oldPrice?: number;

	@IsNumber()
	credit: number;

	@IsString()
	description: string;

	@IsString()
	advantages: string;

	@IsString()
	@IsOptional()
	disAdvantages?: string;

	@IsArray()
	@IsString({ each: true })
	categories: string[];

	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsArray()
	@ValidateNested()
	@Type(() => ProductCharacteristicDto)
	characteristics: ProductCharacteristicDto[];
}
