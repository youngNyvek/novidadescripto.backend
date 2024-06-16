import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GetNewsUseCase } from 'src/domain/useCases/getNews.useCase';

const CRON_PATTERN = '0 8,16,0 * * *';

@Injectable()
export class UpdateNewsWorker {
  private readonly getNewsUseCase: GetNewsUseCase;

  @Cron(CRON_PATTERN)
  async execute(): Promise<any> {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const news = this.getNewsUseCase.getNews();

    return news;
  }
}
