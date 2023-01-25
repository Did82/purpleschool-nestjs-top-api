import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
	bot: TelegramBot;
	token: string | undefined;
	chatId: number;

	constructor(private readonly configService: ConfigService) {
		this.token = this.configService.get<string>('TELEGRAM_TOKEN');
		if (!this.token) {
			throw new Error('TELEGRAM_TOKEN is not defined');
		}
		this.chatId = Number(
			this.configService.get<number>('TELEGRAM_CHAT_ID'),
		);
		if (!this.chatId) {
			throw new Error('TELEGRAM_CHAT_ID is not defined');
		}
		this.bot = new TelegramBot(this.token, { polling: true });
	}

	async sendMessage(text: string) {
		await this.bot.sendMessage(this.chatId, text);
	}
}
