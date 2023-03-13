import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JobQueueService } from './job-queue.service';
import { TestConsumer } from './test.consumer';
import { JobQueueController } from './job-queue.controller';

@Module({
  imports: [BullModule.registerQueue({ name: 'test' })],
  providers: [JobQueueService, TestConsumer],
  controllers: [JobQueueController],
})
export class JobQueueModule {}
