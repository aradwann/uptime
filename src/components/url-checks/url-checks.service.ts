import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUrlCheckDto } from './dto/create-url-check.dto';
import { UpdateUrlCheckDto } from './dto/update-url-check.dto';
// import { Authentication } from './entities/authentication.entity';
// import { HttpHeader } from './entities/httphHeader.entity';
import { Tag } from './entities/tag.entity';
import { UrlCheck } from './entities/url-check.entity';

@Injectable()
export class UrlChecksService {
  constructor(
    @InjectRepository(UrlCheck) private urlCheckRepo: Repository<UrlCheck>,
  ) {}
  create(createUrlCheckDto: CreateUrlCheckDto, user: User) {
    // const auth = new Authentication();
    // auth.username = createUrlCheckDto.authentication.username;
    // auth.password = createUrlCheckDto.authentication.password;
    const { tags, ...restOfDto } = createUrlCheckDto;
    const tagObjects = tags.map((t) => {
      const tag = new Tag();
      tag.title = t;
      return tag;
    });

    // const headers = httpHeaders.map((h) => {
    //   const header = new HttpHeader();
    //   header.key = h.key;
    //   header.value = h.value;
    //   return header;
    // });

    const urlCheck = this.urlCheckRepo.create(restOfDto);
    urlCheck.creator = user;
    urlCheck.tags = tagObjects;
    // urlCheck.httpHeaders = headers;

    return this.urlCheckRepo.save(urlCheck);
  }

  async findAll(user: User) {
    const urlChecks = await this.urlCheckRepo.find({
      where: { creator: { id: user.id } },
      relations: { creator: true },
    });

    return urlChecks;
  }

  async findOne(id: number) {
    const urlCheck = await this.urlCheckRepo.findOne({
      where: { id },
      relations: { creator: true },
    });
    if (!urlCheck) {
      throw new NotFoundException('urlCheck not found');
    }
    return urlCheck;
  }

  update(id: number, updateUrlCheckDto: UpdateUrlCheckDto) {
    return `This action updates a #${id} urlCheck`;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.urlCheckRepo.remove(user);
  }

  checkIfUserIsCreatorOrThrowFobidden(urlCheck: UrlCheck, user: User) {
    if (urlCheck.creator.id !== user.id) {
      throw new ForbiddenException(
        'Only the check creator can read or modify it ',
      );
    }
  }
}
