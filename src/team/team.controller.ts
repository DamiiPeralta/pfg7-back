import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseUUIDPipe,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, JoinTeamDto, UpdateTeamDto } from './team.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/auth.guard';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamController {
  constructor(private readonly teamsService: TeamService) {}

  @Get('users/:id')
  @ApiOperation({
    summary: 'Gets a team by its ID',
    description:
      'Expects the UUID of the team to get through Params. Returns the found Team object.',
  })
  async getUsersByTeam(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.teamsService.getUserByTeam(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Gets a team by its ID',
    description:
      'Expects the UUID of the team to get through Params. Returns the found Team object.',
  })
  async findTeamById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.teamsService.getTeamById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Gets all teams',
    description:
      'Doesn`t expect any parameters. Returns an array of Team objects.',
  })
  async getTeams() {
    return await this.teamsService.getTeams();
  }

  @Post('join')
  @ApiOperation({
    summary: 'Joins a team',
    description:
      'Expects the user ID and the team code. Returns the joined Team object.',
  })
  async joinTeam(@Body() joinTeamDto: JoinTeamDto) {
    const { userid, code } = joinTeamDto;

    try {
      const team = await this.teamsService.joinTeam(userid, code);
      return { message: 'User successfully added to the team', team };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('An unexpected error occurred:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Post(':id')
  @ApiOperation({
    summary: 'Creates a new team',
    description:
      'Expects the ID of the user creating the team through params and the team data through body. Returns the created Team object.',
  })
  async createTeam(
    @Param('id', ParseUUIDPipe) user_Id: string,
    @Body() teamDto: CreateTeamDto,
  ) {
    return await this.teamsService.createTeam(user_Id, teamDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Updates a team´s properties.',
    description:
      'Expects the UUID of the team to modify through Params and the properties to change through the Body. Returns the modified Team object.',
  })
  async updateTeam(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() team: UpdateTeamDto,
  ) {
    try {
      return await this.teamsService.updateTeam(id, team);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes a Team.',
    description:
      'Expects the UUID of the team to delete through Params. Returns a succes or failure message.',
  })
  async deleteTeam(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.teamsService.deleteTeam(id);
      return { message: 'Team deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':teamId/:userId')
  @ApiOperation({
    summary: 'Remove user to team.',
    description:
      'Expects the UUID of the user and team to remove through Params',
  })
  async removeUserFromTeam(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('teamId', ParseUUIDPipe) teamId: string,
  ) {
    try {
      await this.teamsService.removeUserToTeam(userId, teamId);
      return { message: 'Remove user to team successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':teamId/users/:userId')
  @ApiOperation({
    summary: 'Adds a user to a team.',
    description:
      'Expects the UUIDs of the team and the user to add through Params. Returns the modified Team object.',
  })
  async addUserToTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    try {
      return await this.teamsService.addUserToTeam(userId, teamId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id/leader')
  @ApiOperation({
    summary: 'Gets the teams a user is the leader of.',
    description:
      'Expects the UUID  the user through Params. Returns an array of Team objects.',
  })
  async getTeamsByLeaderId(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.teamsService.getTeamsByLeaderId(id);
    } catch (error) {
      throw new error('Error in getTeamsByLeaderId: ' + error.message);
    }
  }

  @Get(':id/teams')
  @ApiOperation({
    summary: 'Get teams for a user',
    description:
      'Returns the teams where the user is a leader and the teams where the user is a collaborator.',
  })
  async getUserTeams(@Param('id', ParseUUIDPipe) userId: string) {
    try {
      return this.teamsService.getUserTeams(userId);
    } catch (error) {
      throw new error('Error in getUserTeams: ' + error.message);
    }
  }
}
