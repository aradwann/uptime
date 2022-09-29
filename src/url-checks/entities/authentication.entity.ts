import { IsString } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UrlCheck } from './url-check.entity';

@Entity()
export class Authentication {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  username: string;

  @IsString()
  @Column()
  password: string;

  @OneToOne(() => UrlCheck, (urlCheck) => urlCheck.authentication, {
    onDelete: 'CASCADE',
  }) // specify inverse side as a second parameter
  urlCheck: UrlCheck;
}
