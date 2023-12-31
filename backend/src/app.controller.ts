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
    @Query('body') sortBody: string,
    @Query('id') id: string,
    @Query('title') title: string,
  ) {
    // Defaults
    if (!page) page = 1;
    if (!limit) limit = 10;
    return this.appService.myData(page, limit, query, sortBody, id, title);
  }
}
