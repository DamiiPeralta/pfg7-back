<<<<<<< HEAD
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamDto } from './team.dto';
=======
import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
>>>>>>> 2a673bafebf1ec4e8808c035f381c429fbfb38dd

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamController {
  constructor(private readonly teamsService: TeamService) {}

  @Get()
  async getTeams() {
    return await this.teamsService.getAllTeams();
  }

  @Get(':id')
  async findTeamById(@Param('id') id: string) {
    try {
      return await this.teamsService.getTeamById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async createTeam(@Body() teamDto: TeamDto) {
    return await this.teamsService.createTeam(teamDto);
  }

  @Put(':id')
  async updateTeam(@Param('id') id: string, @Body() teamDto: TeamDto) {
    try {
      return await this.teamsService.updateTeam(id, teamDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async deleteTeam(@Param('id') id: string) {
    try {
      await this.teamsService.deleteTeam(id);
      return { message: 'Team deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
