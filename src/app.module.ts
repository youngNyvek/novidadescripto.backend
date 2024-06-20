import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsController } from './webApi/controllers/news.controller';
import { UpdateNewsWorker } from './webApi/workers/updateNews.worker';
import { GetNewsUseCase } from './domain/useCases/getNews.useCase';
import { UpdateNewsUseCase } from './domain/useCases/updateNews.useCase';
import { AuthMiddleware } from './webApi/middlewares/auth.middleware';
import { PrismaModule } from './domain/services/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), PrismaModule],
  controllers: [NewsController],
  providers: [GetNewsUseCase, UpdateNewsWorker, UpdateNewsUseCase],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware);
  }
}
