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
import { Sprint } from 'src/sprint/sprint.entity';

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
        sprint: true,
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
        sprint: true,
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

  async create(task: Partial<Task>, team: Team, sprint: Sprint): Promise<Task> {
    try {
      task.team = team;
      task.sprint = sprint;
      const createdAt = new Date();
      task.created = createdAt.toLocaleString();
      const newTask = this.taskRepository.create(task);

      await this.taskRepository.save(newTask);
      const taskCreated = this.taskRepository.findOne({
        where: { task_id: newTask.task_id },
        relations: ['team','sprint'],
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

  async assignTask(id: string, idUser: string): Promise<void> {
    try {
      const task = await this.findById(id);
  console.log(task);
  
      const userTeam = await this.teamRepository.getUsersByTeam(task.team.team_id);
  console.log(userTeam);
  
      const user = userTeam.find(user => user.user_id === idUser);
  console.log(user);
  
      if (user) {
        task.user_owner = user;
        await this.taskRepository.save(task);
        return Promise.resolve();
      } else {
        throw new Error(`User with id ${idUser} is not part of the team for this task.`);
      }
    } catch (error) {
      throw new Error(`Failed to assign user as owner: ${error.message}`);
    }
  }
  
  
  }
  
