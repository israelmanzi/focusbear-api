import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as morgan from 'morgan';
import { json } from 'express';
import { ConfigService } from '@nestjs/config';
declare const module: any;
config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    json({
      limit: '20mb',
    }),
  );
  app.use(morgan('short'));

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(configService.get('PORT') || 3000);
  app.useLogger(new Logger());
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
