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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks() {
    return await this.taskService.getAllTask();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.taskService.getTaskById(id);
  }

  @Post()
  async create(@Body() newTask: CreateTaskDto) {
    const task = await this.taskService.createTask(newTask);
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
