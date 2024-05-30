import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Body,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { Task } from './task.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getAllTask();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }
  @Get('search/by-name')
  async getTasksByName(@Query('name') taskName: string): Promise<Task[]> {
    return await this.taskService.getTaskByName(taskName);
  }
  @Get('user/:id')
  async getTasksByUserOwner(@Param('id') userId: string): Promise<Task[]> {
    return await this.taskService.getTaskByUserOwner(userId);
  }

  @Get('collaborator/:id')
  async getTasksByCollaborator(@Param('id') userId: string): Promise<Task[]> {
    return await this.taskService.getTaskByCollaborator(userId);
  }

  @Get('team/:id')
  async getTasksByTeam(@Param('id') teamId: string): Promise<Task[]> {
    return await this.taskService.getTaskByTeam(teamId);
  }

  @Post()
  async create(
    @Param('idTeam') teamId: string,
    @Param('idUserOwner') userOwnerId: string,
    @Body() newTask: CreateTaskDto,
  ) {
    const task = await this.taskService.createTask(
      newTask,
      teamId,
      userOwnerId,
    );
    return task;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTask: UpdateTaskDto) {
    try {
      return await this.taskService.updateTask(id, updateTask);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.taskService.deleteTask(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
