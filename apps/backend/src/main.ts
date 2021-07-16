import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ExceptionFilter } from './app/filters/exception/exception.filter';

import { version } from '../../../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const [major] = version.split('.');
  const globalPrefix = `api/v${major}`;
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.useGlobalFilters(new ExceptionFilter());

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  }).catch((e: Error) => {
    Logger.error(e.message, e.stack, 'App.bootstrap');
  });
}

bootstrap();
