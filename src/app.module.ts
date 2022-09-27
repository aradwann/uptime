import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UrlChecksModule } from './url-checks/url-checks.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [UsersModule, UrlChecksModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
