import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlCheck } from 'src/url-checks/entities/url-check.entity';
import { Repository } from 'typeorm';

import { Log } from './entities/log.entity';
import { Status } from './entities/report.entity';

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

  createLog(urlcheck: UrlCheck, status: Status, responseTime?: number) {
    let log;
    if (responseTime) {
      log = new Log(status, responseTime);
    } else {
      log = new Log(status);
    }
    log.urlCheck = urlcheck;

    return this.logRepo.save(log);
  }

  async getStatusCount(urlCheck: UrlCheck, status: Status) {
    return await this.logRepo
      .createQueryBuilder('log')
      .leftJoin('log.urlCheck', 'urlCheck')
      .where('log.urlCheck = :urlCheckId', { urlCheckId: urlCheck.id })
      .andWhere('log.status = :status', { status })
      .getCount();
  }
  async queryLogValues(urlCheck: UrlCheck) {
    const upCount = await this.getStatusCount(urlCheck, Status.UP);

    const downCount = await this.getStatusCount(urlCheck, Status.DOWN);

    const uptime = upCount * urlCheck.interval;
    const downtime = downCount * urlCheck.interval;

    const availability = (upCount / (downCount + upCount)) * 100;

    const latestLog = await this.logRepo
      .createQueryBuilder('log')
      .leftJoin('log.urlCheck', 'urlCheck')
      .where('log.urlCheck = :urlCheckId', { urlCheckId: urlCheck.id })
      .orderBy({ 'log.createdDate': 'DESC' })
      .getOne();

    const logs = await this.logRepo
      .createQueryBuilder('log')
      .leftJoin('log.urlCheck', 'urlCheck')
      .where('log.urlCheck = :urlCheckId', { urlCheckId: urlCheck.id })
      .getMany();

    const { avgResponseTime } = await this.logRepo
      .createQueryBuilder('log')
      .leftJoin('log.urlCheck', 'urlCheck')
      .select('AVG(log.responseTime)', 'avgResponseTime')
      .where('log.urlCheck = :urlCheckId', { urlCheckId: urlCheck.id })
      .andWhere('log.responseTime IS NOT NULL')
      .getRawOne();

    return {
      status: latestLog.status,
      availability,
      outages: downCount,
      downtime,
      uptime,
      responseTime: avgResponseTime,
      histroy: logs,
    };
  }

  async getReport(urlCheck: UrlCheck) {
    const reportVals = await this.queryLogValues(urlCheck);
    return reportVals;
  }
}
