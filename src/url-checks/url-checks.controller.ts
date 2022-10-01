import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UrlChecksService } from './url-checks.service';
import { CreateUrlCheckDto } from './dto/create-url-check.dto';
import { UpdateUrlCheckDto } from './dto/update-url-check.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from 'src/reports/reports.service';

@ApiTags('UrlCheck')
@Controller('url-checks')
export class UrlChecksController {
  constructor(
    private readonly urlChecksService: UrlChecksService,
    private readonly reportService: ReportsService,
  ) {}

  @Post()
  create(
    @Body() createUrlCheckDto: CreateUrlCheckDto,
    @CurrentUser() user: User,
  ) {
    return this.urlChecksService.create(createUrlCheckDto, user);
  }

  @Get()
  findAll() {
    return this.urlChecksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.urlChecksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUrlCheckDto: UpdateUrlCheckDto,
  ) {
    return this.urlChecksService.update(+id, updateUrlCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlChecksService.remove(+id);
  }

  @Get(':id/report')
  async getReport(@Param('id') id: number) {
    const urlcheck = await this.urlChecksService.findOne(id);
    return this.reportService.getReport(urlcheck);
  }
}
