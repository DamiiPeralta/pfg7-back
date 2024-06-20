import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';


@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/users')
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Users',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedUsers() {
    return this.seederService.seedUsers();
  }

  @Post('/teams')
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Teams',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedTeams() {
    return this.seederService.seedTeams();
  }

  @Post('/sprints')
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Sprints',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedSprint() {
    return this.seederService.seedSprints();
  }

  @Post('/tasks')
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Seed Tasks',
    description:
      'Doesn´t expect any parameters. Returns a success message, an error message or an already seeded message.',
  })
  seedTasks() {
    return this.seederService.seedTasks();
  }
}
