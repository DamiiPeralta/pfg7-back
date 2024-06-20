import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/auth.guard';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/users')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Seed Users',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedUsers() {
    return this.seederService.seedUsers();
  }

  @Post('/teams')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Seed Teams',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedTeams() {
    return this.seederService.seedTeams();
  }

  @Post('/sprints')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Seed Sprints',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedSprint() {
    return this.seederService.seedSprints();
  }

  @Post('/tasks')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Seed Tasks',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedTasks() {
    return this.seederService.seedTasks();
  }
}
