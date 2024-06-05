import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SprintService } from './sprint.service';
import { Sprint } from './sprint.entity';
import { CreateSprintDto, UpdateSprintDto } from './sprint.dto';

@ApiTags('Sprint')
@ApiBearerAuth()
@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sprints',
  description: 'Doesn`t expect any parameters. Returns an array of Sprint objects.'
 })
  async getSprints(): Promise<Sprint[]> {
    try {
      return await this.sprintService.getAllSprints();
    } catch (error) {
      throw new NotFoundException('Failed to fetch sprints');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single sprint by Id',
    description: 'Expects an UUID through Params. Returns a single Sprint object.'
   })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Sprint> {
    try {
      return await this.sprintService.getSprintById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('team/:id')
  @ApiOperation({ summary: 'Get all sprints by team Id', 
    description: 'Expects an UUID through Params. Returns an array of Sprint objects belonging to a team.'
  })
  async getSprintsByTeam(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Sprint[]> {
    try {
      return await this.sprintService.getTaskByTeam(id);
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks by sprints');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new sprint',
    description: 'Expects the team ID as a query parameter and the sprint properties through the body. Returns the created Sprint object.'
  })
  async create(
    @Query('idTeam', ParseUUIDPipe) teamId: string,
    @Body() newSprint: CreateSprintDto,
  ) {
    try {
      const sprint = await this.sprintService.createSprint(newSprint, teamId);
      return sprint;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates a sprint', 
    description: 'Expects an UUID through Params and the sprint properties through the body. Returns the modified Sprint object.'
  })
  async update(
    @Param('id') id: string,
    @Body() updateSprint: UpdateSprintDto,
  ): Promise<Sprint> {
    try {
      return await this.sprintService.updateSprint(id, updateSprint);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary:'Deletes a sprint',
    description: 'Expects the UUID of the srint to delete through Params. Returns a succes or failure message.'
  })
  async remove(@Param('id') id: string) {
    try {
      await this.sprintService.deleteSprint(id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
