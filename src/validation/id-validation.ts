import { IsMongoId, IsString } from 'class-validator';

export class IdValidation {
	@IsMongoId()
	@IsString()
	id: string;
}

export class ProductIdValidation {
	@IsMongoId()
	@IsString()
	productId: string;
}
