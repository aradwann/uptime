import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
