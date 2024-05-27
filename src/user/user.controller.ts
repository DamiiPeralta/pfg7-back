import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';

@Controller('users')
export class UserController {

  @Get()
  findAll() {
    return 'Este es un GET de users';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Este es un GET de user con id: ${id}`;
  }

  @Post()
  create() {
    return 'Este es un POST de user';
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `Este es un PUT de user con id: ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Este es un DELETE de user con id: ${id}`;
  }
}
