import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //////////////////// SETUP VALIDATION PIPE ///////////////
  app.useGlobalPipes(
    new ValidationPipe({
      // setting whitelist to true trim any additional unwanted props/values in the request body
      // that's not defined by the dto and doesn't have validation decorators
      whitelist: true,
      transformOptions: {
        // enable implicit conversion of the received params over the network
        // as the network transfer all values as strings we need to convert them
        // to their correct types to be appropriatly used
        // such as query params used in pagination
        // enabling this option makes the params converted to integers automatically
        enableImplicitConversion: true,
      },
    }),
  );

  ////////////////////////////// SETUP SWAGGER (OPEN API) ////////////////////////
  const options = new DocumentBuilder()
    .setTitle('uptime')
    .setDescription(
      'uptime is a utility to monitor and log the availability \
      of the URLs added by authenticated users and get the report for its uptime and downtime ',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  ////////////////////////// CORS ///////////////////////////////////
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
