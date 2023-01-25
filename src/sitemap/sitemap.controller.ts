import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TopPageService } from '../top-page/top-page.service';
import { Builder } from 'xml2js';
import { format, subDays } from 'date-fns';

@Controller('sitemap')
export class SitemapController {
	domain: string;

	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService,
	) {
		this.domain = this.configService.get<string>('DOMAIN') || '';
	}

	@Get('xml')
	@Header('Content-Type', 'text/xml')
	async createSitemap() {
		const pattern = `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`;
		const pages = await this.topPageService.findAll();
		let res = [
			{
				loc: this.domain,
				lastmod: format(subDays(new Date(), 1), pattern),
				changefreq: 'daily',
				priority: 1,
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: format(subDays(new Date(), 1), pattern),
				changefreq: 'daily',
				priority: 1,
			},
		];

		res = res.concat(
			pages.map((page) => ({
				loc: `${this.domain}/${page.firstCategory}/${page.alias}`,
				lastmod: format(new Date(page.updatedAt), pattern),
				changefreq: 'weekly',
				priority: 0.7,
			})),
		);

		const builder = new Builder({
			xmldec: {
				version: '1.0',
				encoding: 'UTF-8',
			},
		});

		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
				},
				url: res,
			},
		});
	}
}
