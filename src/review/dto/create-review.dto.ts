export class CreateReviewDto {
	// @IsString()
	// @IsNotEmpty()
	name: string;

	// @IsString()
	// @IsNotEmpty()
	title: string;

	// @IsString()
	// @IsNotEmpty()
	description: string;

	// @IsNumber()
	rating: number;

	// @IsString()
	// @IsNotEmpty()
	productId: string;
}
