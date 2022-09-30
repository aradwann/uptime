import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

/**
 * TODO:
 * - report is created when urlCheck is created
 * - cron jobs is initiated when the report is created
 * - setup a cron job
 * - that requests a certain url every interval of time, insert a log and updates the report in the DB
 */

@Injectable()
export class PollingService {
  private readonly logger = new Logger(PollingService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
  ) {
    this.addInterval('myCrooooooooooon', 20_000);
    // setTimeout(() => {
    //   this.deleteInterval('myCrooooooooooon');
    // }, 60_000);
  }

  addInterval(name: string, milliseconds: number) {
    const callback = async () => {
      const start = Date.now();
      const res = await this.httpService.get('https://www.twitter.com');
      console.log({ res });

      const millis = Date.now() - start;

      this.logger.warn(`Interval ${name} executing at time (${milliseconds})!\
       and the respose time is ${millis} millisecond `);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }
  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    this.logger.warn(`Interval ${name} deleted!`);
  }
}
