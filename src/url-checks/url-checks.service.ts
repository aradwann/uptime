import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
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

  findAll() {
    return this.urlCheckRepo.find();
  }

  findOne(id: number) {
    return this.urlCheckRepo.findOneBy({ id });
  }

  update(id: number, updateUrlCheckDto: UpdateUrlCheckDto) {
    return `This action updates a #${id} urlCheck`;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.urlCheckRepo.remove(user);
  }
}
