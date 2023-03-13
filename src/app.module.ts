import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './components/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './components/auth/guards/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { validate } from './config/env.validation';
import { envFilePath } from './config/configuration';
import { EmailModule } from './components/email/email.module';
import { PollingModule } from './components/polling/polling.module';
import { ReportsModule } from './components/reports/reports.module';
import { UrlChecksModule } from './components/url-checks/url-checks.module';
import { UsersModule } from './components/users/users.module';
import { BullModule } from '@nestjs/bullmq';

// import { UrlCheckSubscriber } from './url-checks/entities/subscribers/url-check.subscriber';
import { JobQueueModule } from './components/job-queue/job-queue.module';

@Module({
  imports: [
    // first setup configure module because the following modules depends on it
    // to retrieve its configuration variables
    ConfigModule.forRoot({ isGlobal: true, validate, envFilePath }),

    // here I choose to get config vars through use factory so the order doesn't matter
    // because it's gonna always depend on the config service which will be resolved by nest runtime
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        // subscribers: [UrlCheckSubscriber],
        synchronize: true, // remove this in production, it may lead to loss of data
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
        },
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
    JobQueueModule,
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
