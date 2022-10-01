import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Log } from './entities/log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
