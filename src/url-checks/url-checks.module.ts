import { Module } from '@nestjs/common';
import { UrlChecksService } from './url-checks.service';
import { UrlChecksController } from './url-checks.controller';

@Module({
  controllers: [UrlChecksController],
  providers: [UrlChecksService]
})
export class UrlChecksModule {}
