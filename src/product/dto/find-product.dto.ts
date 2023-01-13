import { IsInt, IsString } from 'class-validator';

export class FindProductDto {
	@IsString()
	category: string;

	@IsInt()
	limit: number;
}
