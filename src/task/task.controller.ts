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
  // UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { Task } from './task.entity';
// import { AdminGuard } from 'src/auth/auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  // @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'Doesn`t expect any parameters. Returns an array of Task objects.',
  })
  async getTasks(): Promise<Task[]> {
    try {
      return await this.taskService.getAllTask();
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks');
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task by ID',
    description:
      'Expects the task ID as a path parameter through params. Returns a Task object for the specified task.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    try {
      return await this.taskService.getTaskById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('team/:id')
  @ApiOperation({
    summary: 'Get tasks by team ID',
    description:
      'Expects the team ID as a query parameter through params. Returns an array of Task objects for the specified team.',
  })
  async getTasksByTeam(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Task[]> {
    try {
      return await this.taskService.getTaskByTeam(id);
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks by team');
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a new task',
    description:
      'Expects the team ID and sprint ID as query parameters through params and the task properties through the Body. Returns the created Task object.',
  })
  async create(
    @Query('idTeam', ParseUUIDPipe) teamId: string,
    @Query('idSprint', ParseUUIDPipe) idSprint: string,
    @Body() newTask: CreateTaskDto,
  ) {
    try {
      const task = await this.taskService.createTask(newTask, teamId, idSprint);
      return task;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':taskId/assign/:userId')
  @ApiOperation({
    summary: 'Assign user owner.',
    description:
      'Assigns a user as the owner of a task. Expects taskId and userId as parameters.',
  })
  async assignTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    try {
      await this.taskService.assignTask(taskId, userId);
      return { message: 'User assigned successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Updates a task´s properties.',
    description:
      'Expects the UUID of the task to modify through Params and the properties to change through the Body. Returns the modified Task object.',
  })
  async update(@Param('id') id: string, @Body() updateTask: UpdateTaskDto) {
    try {
      return await this.taskService.updateTask(id, updateTask);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes a Task.',
    description:
      'Expects the UUID of the task to delete through Params. Returns a succes or failure message.',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.taskService.deleteTask(id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
