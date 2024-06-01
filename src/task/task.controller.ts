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
    try {
      return await this.taskService.getAllTask();
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks');
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    try {
      return await this.taskService.getTaskById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get('search/by-name')
  async getTasksByName(@Query('name') taskName: string): Promise<Task[]> {
    try {
      return await this.taskService.getTaskByName(taskName);
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks by name');
    }
  }
  @Get('user/:id')
  async getTasksByUserOwner(@Param('id') userId: string): Promise<Task[]> {
    try {
      return await this.taskService.getTaskByUser(userId);
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks by user');
    }
  }

  @Get('collaborator/:id')
  async getTasksByCollaborator(@Param('id') userId: string): Promise<Task[]> {
    try {
      return await this.taskService.getTaskByCollaborator(userId);
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks by collaborator');
    }
  }

  @Get('team/:id')
  async getTasksByTeam(@Param('id') teamId: string): Promise<Task[]> {
    try {
      return await this.taskService.getTaskByTeam(teamId);
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks by team');
    }
  }

  @Post()
  async create(
    @Query('idTeam') teamId: string,
    @Query('idUserOwner') userOwnerId: string,
    @Body() newTask: CreateTaskDto,
  ) {
    try {
      const task = await this.taskService.createTask(newTask, teamId, userOwnerId);
      return task;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
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
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
