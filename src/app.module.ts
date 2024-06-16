import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsController } from './webApi/controllers/news.controller';
import { UpdateNewsWorker } from './webApi/workers/updateNews.worker';
import { GetNewsUseCase } from './domain/useCases/getNews.useCase';
import { AuthMiddleware } from './webApi/middlewares/auth.middleware';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [NewsController],
  providers: [GetNewsUseCase, UpdateNewsWorker],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware);
  }
}
