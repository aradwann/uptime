import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JobQueueService } from './job-queue.service';
import { TestConsumer } from './test.consumer';

@Module({
  imports: [BullModule.registerQueue({ name: 'test' })],
  providers: [JobQueueService, TestConsumer],
})
export class JobQueueModule {}
