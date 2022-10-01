import { IsEnum, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from './report.entity';

@Entity()
export class Log {
  constructor(status: Status, responseTime?: number) {
    this.status = status;
    if (responseTime) {
      this.responseTime = responseTime;
    } else {
      this.responseTime = null;
    }
  }
  @PrimaryGeneratedColumn()
  id: number;

  //The current status of the URL.
  @IsEnum(Status)
  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  // The response time for the URL.
  @IsNumber()
  @Column({ nullable: true })
  responseTime?: number;

  @CreateDateColumn()
  createdDate: Date;
}
