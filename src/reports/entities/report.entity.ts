import { IsEnum, IsNumber } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Log } from './log.entity';

export enum Status {
  UP = 'UP',
  DOWN = 'DOWN',
}
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  //The current status of the URL.
  @IsEnum(Status)
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.UP,
  })
  status: Status;

  // A percentage of the URL availability.
  @IsNumber()
  @Column('double')
  availability: number;

  // The total number of URL downtimes.
  @IsNumber()
  @Column()
  outages: number;

  // The total time, in seconds, of the URL downtime.
  @IsNumber()
  @Column()
  downtime: number;

  // The total time, in seconds, of the URL uptime.
  @IsNumber()
  @Column()
  uptime: number;

  // The average response time for the URL.
  @IsNumber()
  @Column()
  responseTime: number;

  // Timestamped logs of the polling requests.
  @OneToMany(() => Log, (log) => log.report, {
    cascade: true,
  })
  logs: Log[];
}
