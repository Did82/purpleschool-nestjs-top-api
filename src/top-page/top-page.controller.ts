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
import { Cron, CronExpression } from '@nestjs/schedule';
import { HhService } from 'src/hh/hh.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IdValidation } from '../validation/id-validation';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return await this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param() params: IdValidation) {
		const topPage = await this.topPageService.findById(params.id);
		if (!topPage) {
			throw new NotFoundException('Top page not found');
		}
		return topPage;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const topPage = await this.topPageService.findByAlias(alias);
		if (!topPage) {
			throw new NotFoundException('Top page not found');
		}
		return topPage;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param() params: IdValidation) {
		try {
			await this.topPageService.delete(params.id);
		} catch (error) {
			throw new NotFoundException('Top page not found');
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param() params: IdValidation, @Body() dto: CreateTopPageDto) {
		try {
			return await this.topPageService.update(params.id, dto);
		} catch (error) {
			throw new NotFoundException('Top page not found');
		}
	}

	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return await this.topPageService.findByCategory(dto.firstCategory);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: 'updateHh',
		timeZone: 'Europe/Minsk',
	})
	async test() {
		const data = await this.topPageService.findForHhUpdate(new Date());
		for (const topPage of data) {
			const hhData = await this.hhService.getVacancies(topPage.category);
			await this.topPageService.update(topPage.id, hhData);
			// await this.sleep(100);
		}
	}

	// private async sleep(ms: number) {
	// 	return new Promise((resolve) => {
	// 		setTimeout(resolve, ms);
	// 	});
	// }
}
