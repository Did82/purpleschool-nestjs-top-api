import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { FileElementResponse } from './dto/file-element.response';
import { MFile } from './mFile.class';

@Injectable()
export class FilesService {
	async upload(files: MFile[]): Promise<FileElementResponse[]> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		await ensureDir(uploadFolder);

		return await Promise.all(
			files.map(async (file) => {
				await writeFile(
					`${uploadFolder}/${file.originalname}`,
					file.buffer,
				);
				return {
					url: `${dateFolder}/${file.originalname}`,
					name: file.originalname,
				};
			}),
		);
	}

	async convertToWebp(file: Buffer): Promise<Buffer> {
		return await sharp(file).webp().toBuffer();
	}
}
