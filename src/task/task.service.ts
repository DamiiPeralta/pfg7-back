import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TeamService } from 'src/team/team.service';
import { SprintService } from 'src/sprint/sprint.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly teamService: TeamService,
    private readonly sprintService: SprintService
  ) {}

  async getAllTask(): Promise<Task[]> {
    try {
      return await this.taskRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findById(id);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve task');
    }
  }

  async getTaskByTeam(id: string): Promise<Task[]> {
    try {
      return await this.taskRepository.findByTeam(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve tasks by team',
      );
    }
  }

  async createTask(task: Partial<Task>, teamId: string, sprintId: string): Promise<Task> {
    const team = await this.teamService.getTeamById(teamId);
    if (team === undefined) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
    const sprint = await this.sprintService.getSprintById(sprintId);
    if (sprint === undefined) {
      throw new NotFoundException(`Sprint with ID ${sprintId} not found`)
    }

    try {
      return await this.taskRepository.create(task, team, sprint);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    try {
      const updatedTask = await this.taskRepository.update(id, task);
      if (!updatedTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.taskRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }

  async assignTask(id: string, idUser: string): Promise<void> {
    try {
      await this.taskRepository.assignTask(id, idUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to assing task');
    }
  }
}
