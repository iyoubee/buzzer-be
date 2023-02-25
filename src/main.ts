import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'https://buzzer-be.vercel.app',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3333);
}
bootstrap();
