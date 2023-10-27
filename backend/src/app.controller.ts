import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('query') query: string,
  ) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    return this.appService.myData(page, limit, query);
  }

  // @Get('search')
  // getQuery(@Query('query') query: string) {
  //   console.log('query', query);
  //   return this.appService.myQuery(query);
  // }
}
