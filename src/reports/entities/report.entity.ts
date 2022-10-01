import { InjectRepository } from '@nestjs/typeorm';
import { IsEnum, IsNumber } from 'class-validator';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

export enum Status {
  UP = 'UP',
  DOWN = 'DOWN',
}

export class Report {
  //The current status of the URL.
  @IsEnum(Status)
  status: Status;

  // A percentage of the URL availability.
  @IsNumber()
  availability: number;

  // The total number of URL downtimes.
  @IsNumber()
  outages: number;

  // The total time, in seconds, of the URL downtime.
  @IsNumber()
  downtime: number;

  // The total time, in seconds, of the URL uptime.
  @IsNumber()
  uptime: number;

  // The average response time for the URL.
  @IsNumber()
  responseTime: number;
}
