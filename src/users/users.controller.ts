import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // make this endpoint public aka functioning for unauthenticated users
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationQuery?: PaginationQueryDto) {
    return this.usersService.findAll(paginationQuery);
  }

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @ApiNotFoundResponse({ description: 'not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @ApiNotFoundResponse({ description: 'not found' })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    if (user.id !== +id) {
      throw new ForbiddenException('only account owner can update the info');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiNotFoundResponse({ description: 'not found' })
  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    if (user.id !== +id) {
      throw new ForbiddenException('only account owner can delete it');
    }
    return this.usersService.remove(id);
  }

  @ApiNotFoundResponse({ description: 'not found' })
  @Get(':id/verify/:token')
  verifyEmail(@Param('id') id: number, @Param('token') token: string) {
    return this.usersService.verfiyEmail(id, token);
  }

  @Get(':id/send-email-verification-token')
  sendEmailVerificationToken(@Param('id') id: number) {
    return this.usersService.SendEmailVerificationToken(id);
  }
}
