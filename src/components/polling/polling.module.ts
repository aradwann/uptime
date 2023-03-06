import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { PollingController } from './polling.controller';
import { HttpModule } from '@nestjs/axios';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [HttpModule, ReportsModule],
  controllers: [PollingController],
  providers: [PollingService],
  exports: [PollingService],
})
export class PollingModule {}
