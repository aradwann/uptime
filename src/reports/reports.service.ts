import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from './entities/log.entity';
import { Report, Status } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Log) private logRepo: Repository<Log>) {}
  create() {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  createLog(status: Status, responseTime?: number) {
    let log;
    if (responseTime) {
      log = new Log(status, responseTime);
    } else {
      log = new Log(status);
    }

    return this.logRepo.save(log);
  }
  async queryLogValues() {
    const [upLogs, upCount] = await this.logRepo.findAndCountBy({
      status: Status.UP,
    });

    const [downLogs, downCount] = await this.logRepo.findAndCountBy({
      status: Status.DOWN,
    });

    const availability = (upCount / (downCount + upCount)) * 100;

    const { status } = await this.logRepo
      .createQueryBuilder('log')
      .select('log.status', 'status')
      .orderBy('id', 'DESC')
      .limit(1)
      .getRawOne();

    const { avgResponseTime } = await this.logRepo
      .createQueryBuilder('log')
      .select('AVG(log.responseTime)', 'avgResponseTime')
      .where('log.responseTime IS NOT NULL')
      .getRawOne();

    return { upCount, downCount, availability, status, avgResponseTime };
  }

  async getReport() {
    // const report = new Report(this.logRepo);
    const reportVals = await this.queryLogValues();
    console.log(reportVals);
    return reportVals;
  }
}
