import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('news')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getNews(): any {
    return this.appService.getNews();
  }
}
