import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamController {

  @Get()
  findAll() {
    return 'Este es un GET de teams';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Este es un GET de team con id: ${id}`;
  }

  @Post()
  create() {
    return 'Este es un POST de team';
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `Este es un PUT de team con id: ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Este es un DELETE de team con id: ${id}`;
  }
}
