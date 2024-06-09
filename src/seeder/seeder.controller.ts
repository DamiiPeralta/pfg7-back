import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/users')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Users',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedUsers() {
    return this.seederService.seedUsers();
  }

  @Post('/teams')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Teams',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })

  @Post('/sprints')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Sprints',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedSprint() {
    console.log('papas aqui');
    //return this.seederService.seedTasks();
  }

  seedTeams() {
    return this.seederService.seedTeams();
  }
  @Post('/tasks')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Tasks',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedTasks() {
    return this.seederService.seedTasks();
  }
}
