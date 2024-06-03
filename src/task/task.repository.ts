import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Team } from 'src/team/team.entity';
import { TeamRepository } from 'src/team/team.repository';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly teamRepository: TeamRepository,
  ) {}

  async findAll(): Promise<Task[]> {
    try {
      const tasks: Task[] = await this.taskRepository.find({relations: {
        user_owner: true,
        team: true,
      },});
      if (tasks.length === 0) {
        return [];
      }
      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: id },
      relations: {
        user_owner: true,
        team: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async findByTeam(teamId: string): Promise<Task[]> {
    try {
      const team = await this.teamRepository.findTeamById(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }
  
      const tasks = team.tasks;
      if (tasks.length === 0) {
        throw new NotFoundException(`Team with ID ${teamId} has no tasks`);
      }
      return tasks;
    } catch (error) {
        console.error(`Error in findByTeam: ${error.message}`);
      throw error;
    }
  }

  async create(task: Partial<Task>, team: Team): Promise<Task> {
    try {
      task.team = team;

      const createdAt = new Date();
      task.created = createdAt.toLocaleString();

      const newTask = this.taskRepository.create(task);

      await this.taskRepository.save(newTask);
      const taskCreated = this.taskRepository.findOne({
        where: { task_id: newTask.task_id },
        relations: ['team'],
      });
      return taskCreated;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    try {
      await this.taskRepository.update(id, task);

      const updatedTask = await this.taskRepository.findOneBy({ task_id: id });

      if (!updatedTask) {
        throw new Error(`Task with ID ${id} not found after update`);
      }

      return updatedTask;
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findOneBy({ task_id: id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskRepository.softRemove(task);
  }
}
