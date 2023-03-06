import { IsString, IsEmail, MinLength, IsBoolean } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UrlCheck } from 'src/components/url-checks/entities/url-check.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  // doesn't return the password field with the user object
  // except when explicty selected with .addSelect('password') on QueryBuilder
  // this to protect  hashed password from being exposed within normal queries
  @Column({
    select: false,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @Column({ nullable: true })
  @IsString()
  firstName: string;

  @Column({ nullable: true })
  @IsString()
  lastName: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isEmailVerified: boolean;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @BeforeInsert()
  private async hashPassowrd() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => UrlCheck, (urlCheck) => urlCheck.creator)
  urlChecks: UrlCheck[];
}
