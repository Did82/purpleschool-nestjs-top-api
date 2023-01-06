import {
	IsString,
	IsNotEmpty,
	IsInt,
	Min,
	Max,
	IsMongoId,
} from 'class-validator';

export class CreateReviewDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@Max(5)
	@Min(1)
	@IsInt()
	rating: number;

	@IsMongoId()
	@IsString()
	@IsNotEmpty()
	productId: string;
}
