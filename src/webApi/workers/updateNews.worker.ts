import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UpdateNewsUseCase } from 'src/domain/useCases/updateNews.useCase';

const CRON_PATTERN = '0 8,16,0 * * *';

@Injectable()
export class UpdateNewsWorker {
  private readonly logger = new Logger(UpdateNewsWorker.name);
  constructor(private readonly updateNews: UpdateNewsUseCase) {}

  @Cron(CRON_PATTERN)
  async execute(): Promise<any> {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    this.logger.debug('Updating news');
    await this.updateNews.execute();
  }
}
