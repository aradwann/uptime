import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { JobQueueService } from './job-queue.service';

@Controller('job-queue')
export class JobQueueController {
  constructor(private readonly jobQueueService: JobQueueService) {}

  @Get('add')
  @Public()
  add() {
    return this.jobQueueService.addRepeatableJob();
  }

  @Get('remove')
  @Public()
  remove() {
    return this.jobQueueService.removeRepeatableJob();
  }
}
