import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { HttpModule } from '@nestjs/axios';
import { ReportsModule } from '../reports/reports.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    HttpModule,
    ReportsModule,
    BullModule.registerQueue({ name: 'polling' }),
  ],
  providers: [PollingService],
  exports: [PollingService],
})
export class PollingModule {}
