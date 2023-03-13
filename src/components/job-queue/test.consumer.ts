import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('test')
export class TestConsumer extends WorkerHost {
  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    console.log(job.data);
  }
}
