import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UrlCheck } from './url-check.entity';

@Entity()
export class HttpHeader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => UrlCheck, (urlCheck) => urlCheck.httpHeaders, {
    onDelete: 'CASCADE',
  })
  urlCheck: UrlCheck;
}
