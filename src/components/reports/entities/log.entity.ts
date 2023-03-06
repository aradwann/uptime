import { IsEnum, IsNumber } from 'class-validator';
import { UrlCheck } from 'src/components/url-checks/entities/url-check.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => UrlCheck, (urlcheck) => urlcheck.logs, {
    onDelete: 'CASCADE',
  })
  urlCheck: UrlCheck;
}
