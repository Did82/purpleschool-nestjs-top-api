import { TopLevelCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsEnum,
	IsString,
	IsOptional,
	IsObject,
	IsArray,
	IsNumber,
	IsDate,
	IsInt,
	ValidateNested,
} from 'class-validator';

export class HhDataDto {
	@IsInt()
	count: number;

	@IsNumber()
	juniorSalary: number;

	@IsNumber()
	middleSalary: number;

	@IsNumber()
	seniorSalary: number;

	@IsDate()
	updatedAt: Date;
}

export class TopPageAdvantageDto {
	@IsString()
	title: string;

	@IsString()
	description: string;
}

export class CreateTopPageDto {
	@IsEnum(TopLevelCategory)
	firstCategory: TopLevelCategory;

	@IsString()
	secondCategory: string;

	@IsString()
	alias: string;

	@IsString()
	title: string;

	@IsString()
	metaTitle: string;

	@IsString()
	metaDescription: string;

	@IsString()
	category: string;

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => HhDataDto)
	hh?: HhDataDto;

	@IsArray()
	@ValidateNested()
	@Type(() => TopPageAdvantageDto)
	advantages: TopPageAdvantageDto[];

	@IsString()
	@IsOptional()
	seoText?: string;

	@IsString()
	tagsTitle: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];
}
