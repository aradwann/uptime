import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class JobQueueService {
  constructor(@InjectQueue('test') private testQueue: Queue) {}

  async addRepeatableJob() {
    console.log('I am gonna test the queue');
    const job = await this.testQueue.add(
      'test',
      {
        ping: 'pong',
      },
      { repeat: { every: 5000 }, jobId: 'test1' },
    );

    console.log({ job });
    console.log({ queueJobs: await this.testQueue.getRepeatableJobs() });
  }

  async removeRepeatableJob() {
    console.log('I am gonna remove the  repeatable test job from the queue');

    this.testQueue.removeRepeatableByKey('test:test1:::5000');
    console.log({ queueJobs: await this.testQueue.getRepeatableJobs() });
  }
}
