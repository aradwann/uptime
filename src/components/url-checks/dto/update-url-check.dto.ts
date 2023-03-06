import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlCheckDto } from './create-url-check.dto';

export class UpdateUrlCheckDto extends PartialType(CreateUrlCheckDto) {}
