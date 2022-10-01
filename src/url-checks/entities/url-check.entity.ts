import { Log } from 'src/reports/entities/log.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Authentication } from './authentication.entity';
import { HttpHeader } from './httphHeader.entity';
import { Tag } from './tag.entity';

export enum Protocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  TCP = 'TCP',
}

/**
 * all time durations are stored in seconds
 */
@Entity()
export class UrlCheck {
  @PrimaryGeneratedColumn()
  id: number;

  // The name of the check.
  @Column()
  name: string;

  // The URL to be monitored.
  @Column()
  url: string;

  // The resource protocol name HTTP, HTTPS, or TCP.
  @Column({
    type: 'enum',
    enum: Protocol,
    default: Protocol.HTTP,
  })
  protocol: Protocol;

  // A specific path to be monitored (optional).
  @Column({ nullable: true })
  path?: string;

  // The server port number (optional).
  @Column({ nullable: true })
  port?: string;

  // A webhook URL to receive a notification on (optional).
  @Column({ nullable: true })
  webhook?: string;

  // The timeout of the polling request (optional). (defaults to 5 seconds)
  @Column('int', { default: 5 })
  timeout: number;

  // The time interval for polling requests (optional). (defaults to 10 minutes)
  @Column('int', { default: 600 })
  interval: number;

  // The threshold of failed requests that will create an alert (optional). (defaults to 1 failure)
  @Column('int', { default: 1 })
  threshold: number;

  // An HTTP authentication header, with the Basic scheme,
  //  to be sent with the polling request (optional).
  @OneToOne(() => Authentication, (authentication) => authentication.urlCheck, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  authentication?: Authentication;

  // A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
  @OneToMany(() => HttpHeader, (header) => header.urlCheck, {
    cascade: true,
    eager: true,
  })
  httpHeaders?: HttpHeader[];

  // The response assertion to be used on the polling response (optional).
  // An HTTP status code to be asserted.
  @Column({ nullable: true })
  assertStatusCode: number;

  // A list of the check tags (optional).
  @OneToMany(() => Tag, (tag) => tag.urlCheck, { cascade: true, eager: true })
  tags: Tag[];

  // A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
  @Column({ default: false })
  ignoreSSL: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.urlChecks)
  creator: User;

  @OneToMany(() => Log, (log) => log.urlCheck)
  logs: Log[];
}
