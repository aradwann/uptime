import { Module } from '@nestjs/common';
import { UrlChecksService } from './url-checks.service';
import { UrlChecksController } from './url-checks.controller';
import { UrlCheck } from './entities/url-check.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Authentication } from './entities/authentication.entity';
import { HttpHeader } from './entities/httphHeader.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlCheck, Tag, Authentication, HttpHeader]),
  ],
  controllers: [UrlChecksController],
  providers: [UrlChecksService],
})
export class UrlChecksModule {}
