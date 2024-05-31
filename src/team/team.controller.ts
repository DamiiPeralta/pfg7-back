import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamController {
  constructor(private readonly teamsService: TeamService) {}

  @Get()
  async getTeams() {
    return await this.teamsService.getTeams();
  }

  @Get(':id')
  async findTeamById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.teamsService.getTeamById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async createTeam(@Param('id', ParseUUIDPipe) user_Id: string,@Body() teamDto: CreateTeamDto) {
    return await this.teamsService.createTeam(user_Id, teamDto);
  }

  @Put(':id')
  async updateTeam(@Param('id', ParseUUIDPipe) id: string, @Body() team: UpdateTeamDto) {
    try {
      return await this.teamsService.updateTeam(id, team);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async deleteTeam(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.teamsService.deleteTeam(id);
      return { message: 'Team deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
