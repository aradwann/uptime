import {
  IsArray,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Protocol } from '../entities/url-check.entity';

export class CreateUrlCheckDto {
  // The name of the check.
  @IsString()
  name: string;

  // The URL to be monitored.
  @IsUrl()
  url: string;

  // The resource protocol name HTTP, HTTPS, or TCP.
  @IsEnum(Protocol)
  protocol: Protocol;

  // A specific path to be monitored (optional).
  @IsOptional()
  @IsString()
  path?: string;

  // The server port number (optional).
  @IsOptional()
  @IsNumberString()
  port?: string;

  // A webhook URL to receive a notification on (optional).
  @IsOptional()
  @IsUrl()
  webhook?: string;

  // The timeout of the polling request (optional). (defaults to 5 seconds)
  @IsOptional()
  @IsNumber()
  timeout: number;

  // The time interval for polling requests (optional). (defaults to 10 minutes)
  @IsOptional()
  @IsNumber()
  interval: number;

  // The threshold of failed requests that will create an alert (optional). (defaults to 1 failure)
  @IsOptional()
  @IsNumber()
  threshold: number;

  // An HTTP authentication header, with the Basic scheme,
  //  to be sent with the polling request (optional).
  // @IsOptional()
  // authentication?: Authentication;

  // A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
  // @IsOptional()
  // @IsArray()
  // httpHeaders: { key: string; value: string }[];

  // The response assertion to be used on the polling response (optional).
  // assert:

  // // An HTTP status code to be asserted.
  // assert.statusCode:

  // A list of the check tags (optional).
  @IsOptional()
  @IsArray()
  tags: string[];

  // A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
  @IsOptional()
  ignoreSSL: boolean;
}
