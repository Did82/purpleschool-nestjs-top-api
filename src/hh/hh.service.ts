import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HhData } from '@prisma/client';
import { catchError, firstValueFrom } from 'rxjs';
import { API_URLS } from './hh.constants';
import { HhResponse } from './hh.models';

@Injectable()
export class HhService {
	private token: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
	) {
		this.token = this.configService.get<string>('HH_TOKEN') || '';
	}

	async getVacancies(text: string): Promise<HhData> {
		const { data } = await firstValueFrom(
			this.httpService
				.get<HhResponse>(API_URLS.vacancies, {
					params: {
						text,
						clusters: true,
					},
					headers: {
						'User-Agent': 'My-App',
						Authorization: `Bearer ${this.token}`,
					},
				})
				.pipe(
					catchError((error) => {
						Logger.error(error);
						throw error;
					}),
				),
		);

		return this.parseData(data);
	}

	private parseData(data: HhResponse): HhData {
		const salaryCluster = data.clusters.find(
			(cluster) => cluster.id === 'salary',
		);
		if (!salaryCluster) {
			throw new Error('Salary cluster not found');
		}
		return {
			count: data.found,
			juniorSalary: this.getSalaryFromString(salaryCluster.items[0].name),
			middleSalary: this.getSalaryFromString(
				salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)]
					.name,
			),
			seniorSalary: this.getSalaryFromString(
				salaryCluster.items[salaryCluster.items.length - 1].name,
			),
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(salaryString: string): number {
		const numberRegex = /\d+/g;
		const numbers = salaryString.match(numberRegex);
		if (!numbers) {
			throw new Error('Salary not found');
		}
		return parseInt(numbers[0], 10);
	}
}
