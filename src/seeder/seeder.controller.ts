import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/users')
  seedUsers(){
    return this.seederService.seedUsers()
  }

  @Post('/teams')
  seedTeams(){
    return this.seederService.seedTeams()
  }
  @Post('/tasks')
  seedTasks(){
    return this.seederService.seedTasks()
  }
}
