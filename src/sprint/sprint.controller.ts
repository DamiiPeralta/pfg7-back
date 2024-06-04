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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SprintService } from './sprint.service';
import { Sprint } from './sprint.entity';
import { CreateSprintDto, UpdateSprintDto } from './sprint.dto';

@ApiTags('Sprint')
@ApiBearerAuth()
@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Get()
  async getSprints(): Promise<Sprint[]> {
    try {
      return await this.sprintService.getAllSprints();
    } catch (error) {
      throw new NotFoundException('Failed to fetch sprints');
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Sprint> {
    try {
      return await this.sprintService.getSprintById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('team/:id')
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
  async remove(@Param('id') id: string) {
    try {
      await this.sprintService.deleteSprint(id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
