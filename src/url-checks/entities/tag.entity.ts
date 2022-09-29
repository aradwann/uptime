import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UrlCheck } from './url-check.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => UrlCheck, (urlCheck) => urlCheck.tags, {
    onDelete: 'CASCADE',
  })
  urlCheck: UrlCheck;
}
