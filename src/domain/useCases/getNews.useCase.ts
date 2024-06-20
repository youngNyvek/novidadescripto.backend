import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';

interface NewsItem {
  title: string;
  imgSrc: string;
  redirectUrl: string;
  displayLink: string;
  dateTime: Date;
}

@Injectable()
export class GetNewsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<NewsItem[]> {
    const allNewsFromDB = await this.prisma.news.findMany({
      orderBy: {
        dateTime: 'desc',
      },
    });

    return allNewsFromDB;
  }
}
