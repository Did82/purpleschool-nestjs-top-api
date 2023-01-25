import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HhService } from './hh.service';

@Module({
	imports: [HttpModule],
	providers: [HhService],
	exports: [HhService],
})
export class HhModule {}
