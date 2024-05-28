import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {

  @Get()
  findAll() {
    return 'Este es un GET de tasks';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Este es un GET de task con id: ${id}`;
  }

  @Post()
  create() {
    return 'Este es un POST de task';
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `Este es un PUT de task con id: ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Este es un DELETE de task con id: ${id}`;
  }
}
