import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // check if the email is taken
    const userEmail = await this.userRepo.findOneBy({
      email: createUserDto.email,
    });
    if (userEmail) {
      throw new BadRequestException(`email is already taken`);
    }
    try {
      const newUser = this.userRepo.create(createUserDto);
      const savedUser = await this.userRepo.save(newUser);
      this.emailService.sendEmailVerification(savedUser);
      return savedUser;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.userRepo.find({ skip: offset, take: limit });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    // throw 404 error id user is not found
    if (!user) {
      throw new NotFoundException(`user with id ${id} is not found`);
    }
    return user;
  }

  async findOneByEmailWithPassword(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    // throw 404 error id user is not found
    if (!user) {
      throw new NotFoundException(`user with email ${email} is not found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    // throw 404 error id user is not found
    if (!user) {
      throw new NotFoundException(`user with email ${email} is not found`);
    }
    return user;
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`user with id ${id} is not found`);
    }

    await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .execute();

    const updatedUser = await this.findOne(id);
    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.userRepo.remove(user);
  }

  async verfiyEmail(id: number, token: string) {
    const user = await this.findOne(id);
    if (this.emailService.verifyEmailToken(token)) {
      user.isEmailVerified = true;
      this.userRepo.save(user);
    } else {
      throw new BadRequestException(
        'email verification token is expired or invalid',
      );
    }
  }

  async SendEmailVerificationToken(id: number) {
    const user = await this.findOne(id);
    await this.emailService.sendEmailVerification(user);
    return { message: 'email verification code sent successfully' };
  }
}
