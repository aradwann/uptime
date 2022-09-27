import { Injectable } from '@nestjs/common';
import { CreateUrlCheckDto } from './dto/create-url-check.dto';
import { UpdateUrlCheckDto } from './dto/update-url-check.dto';

@Injectable()
export class UrlChecksService {
  create(createUrlCheckDto: CreateUrlCheckDto) {
    return 'This action adds a new urlCheck';
  }

  findAll() {
    return `This action returns all urlChecks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} urlCheck`;
  }

  update(id: number, updateUrlCheckDto: UpdateUrlCheckDto) {
    return `This action updates a #${id} urlCheck`;
  }

  remove(id: number) {
    return `This action removes a #${id} urlCheck`;
  }
}
