import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Status } from 'src/reports/entities/report.entity';
import { ReportsService } from 'src/reports/reports.service';
import { Protocol } from 'src/url-checks/entities/url-check.entity';

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
    private reportService: ReportsService,
  ) {
    // this.addInterval(
    //   'myCrooooooooooon',
    //   20_000,
    //   Protocol.HTTP,
    //   'www.twitter.com',
    // );
    // setTimeout(() => {
    //   this.deleteInterval('myCrooooooooooon');
    // }, 60_000);
  }

  addInterval(
    name: string,
    milliseconds: number,
    protocol: Protocol,
    url: string,
  ) {
    const callback = () => {
      this.logger.warn(
        `cron job with name ${name} and interval ${milliseconds} and protocol ${protocol} and url ${url}`,
      );
      const start = Date.now();
      const res = this.httpService
        .get(`${protocol}://${url}`)
        .subscribe((res) => {
          const millis = Date.now() - start;
          if (res.status >= 200 && res.status < 300) {
            this.reportService.createLog(Status.UP, millis);
          } else {
            this.reportService.createLog(Status.DOWN);
          }
        });
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }
  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    this.logger.warn(`Interval ${name} deleted!`);
  }
}
