import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class JobQueueService {
  constructor(@InjectQueue('test') private testQueue: Queue) {}

  async testTheQueue() {
    console.log('I am gonna test the queue');
    const job = await this.testQueue.add(
      'test',
      {
        ping: 'pong',
      },
      { repeat: { every: 5000 } },
    );
    console.log(await this.testQueue.getRepeatableJobs());

    this.testQueue.removeRepeatableByKey(job.repeatJobKey);
  }
}
