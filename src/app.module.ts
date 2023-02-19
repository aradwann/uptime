import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UrlChecksModule } from './url-checks/url-checks.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { EmailModule } from './email/email.module';
import { PollingModule } from './polling/polling.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { UrlCheckSubscriber } from './url-checks/entities/subscribers/url-check.subscriber';

@Module({
  imports: [
    // first setup configure module because the following modules depends on it
    // to retrieve its configuration variables
    ConfigModule.forRoot({ isGlobal: true }),

    // here I choose to get config vars through use factory so the order doesn't matter
    // because it's gonna always depend on the config service which will be resolved by nest runtime
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        // subscribers: [UrlCheckSubscriber],
        synchronize: true, // remove this in production, it may lead to loss of data
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    UrlChecksModule,
    ReportsModule,
    EmailModule,
    PollingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // this makes all the endpoints protected by default
      // except those which are decorated with public decorator
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
