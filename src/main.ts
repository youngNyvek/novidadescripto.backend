import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { verifyToken } from './middlewares/authMiddleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(verifyToken);
  app.enableCors({ origin: '*' });
  await app.listen(3001);
}

bootstrap();
