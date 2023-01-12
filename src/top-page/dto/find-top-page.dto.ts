import { TopLevelCategory } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class FindTopPageDto {
	@IsEnum(TopLevelCategory)
	firstCategory: TopLevelCategory; // TopLevelCategory enum
}
