import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('data')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.appService.getOne(id);
  }

  @Post()
  async create(@Body('data') data: string) {
    return this.appService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('data') data: string) {
    return this.appService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.appService.delete(id);
  }
}
