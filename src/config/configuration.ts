import { Environment } from './env.validation';

let envFilePath: string;

if (process.env.NODE_ENV === Environment.Production) {
  envFilePath = '.env.prod';
} else if (process.env.NODE_ENV === Environment.Test) {
  envFilePath = '.env.test';
} else {
  envFilePath = '.env.dev';
}

export { envFilePath };
