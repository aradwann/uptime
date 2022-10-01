import { Controller, Get, Post, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  generateReport() {
    return this.reportsService.getReport();
  }
}
