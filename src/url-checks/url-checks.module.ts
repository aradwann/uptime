import { Module } from '@nestjs/common';
import { UrlChecksService } from './url-checks.service';
import { UrlChecksController } from './url-checks.controller';
import { UrlCheck } from './entities/url-check.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Authentication } from './entities/authentication.entity';
import { HttpHeader } from './entities/httphHeader.entity';
import { PollingModule } from 'src/polling/polling.module';
import { UrlCheckSubscriber } from './entities/subscribers/url-check.subscriber';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlCheck, Tag, Authentication, HttpHeader]),
    PollingModule,
    ReportsModule,
  ],
  controllers: [UrlChecksController],
  providers: [UrlChecksService, UrlCheckSubscriber],
})
export class UrlChecksModule {}
