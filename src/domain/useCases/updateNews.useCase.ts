import { Injectable } from '@nestjs/common';
import { customsearch_v1, google } from 'googleapis';
import { PrismaService } from '../services/prisma/prisma.service';

interface NewsItem {
  title: string;
  imgSrc: string;
  redirectUrl: string;
  displayLink: string;
  dateTime: Date;
}

export class NewsMapper {
  static convertNews(googleItem: customsearch_v1.Schema$Result): NewsItem {
    return {
      dateTime: new Date(
        googleItem.pagemap['metatags'][0]['article:published_time'] ??
          googleItem.pagemap['metatags'][0]['article:modified_time'],
      ),
      imgSrc:
        googleItem.pagemap['metatags'][0]['twitter:image'] ??
        googleItem.pagemap['metatags'][0]['og:image'],
      redirectUrl: googleItem.link,
      displayLink: googleItem.displayLink,
      title: googleItem.title,
    };
  }
}

@Injectable()
export class UpdateNewsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<any> {
    const urls = process.env.NEWS_URLS.split(',');

    const googleResults: NewsItem[] = [];

    for (const url of urls) {
      const customsearch = google.customsearch('v1');
      const result = await customsearch.cse.list({
        cx: process.env.GOOGLE_CX,
        q: 'cripto',
        auth: process.env.GOOGLE_AUTH,
        sort: 'date',
        filter: '1',
        siteSearch: url,
      });

      const newItem = result?.data?.items
        ?.filter(
          (googleItem) =>
            googleItem?.pagemap['metatags'][0]['og:type'] === 'article' &&
            (!!googleItem.pagemap['metatags'][0]['article:published_time'] ||
              !!googleItem.pagemap['metatags'][0]['article:modified_time']),
        )
        .map((googleItem) => NewsMapper.convertNews(googleItem));

      newItem && googleResults.push(...newItem);
    }

    for (const newsItem of googleResults) {
      const existingNews = await this.prisma.news.findUnique({
        where: { redirectUrl: newsItem.redirectUrl },
      });

      if (!existingNews) {
        await this.prisma.news.create({
          data: newsItem,
        });
      }
    }

    const allNewsFromDB = await this.prisma.news.findMany({
      orderBy: {
        dateTime: 'desc',
      },
    });

    return allNewsFromDB;
  }
}
