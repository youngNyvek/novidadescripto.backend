import { Controller, Get } from '@nestjs/common';
import { GetNewsUseCase } from '../../domain/useCases/getNews.useCase';

@Controller('news')
export class NewsController {
  constructor(private readonly appService: GetNewsUseCase) {}

  @Get()
  getNews(): any {
    return this.appService.getNews();
  }
}
