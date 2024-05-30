import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/user/user.entity';
import { Team } from 'src/team/team.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
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

  async findByName(name: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { name: Like(`%${name}%`) },
      relations: ['team', 'user_owner', 'collaborators'],
    });
    if (tasks.length === 0) {
      throw new NotFoundException(
        `No tasks found with name containing "${name}"`,
      );
    }
    return tasks;
  }

  async findByUserOwner(id: string): Promise<Task[]> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['teams', 'tasks'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const userId: string = user.user_id;

    const teamIds = user.teams.map((team) => team.team_id);

    const tasks = await this.taskRepository.find({
      where: {
        team: { team_id: In(teamIds) },
        user_owner: { user_id: userId },
      },
      relations: ['team', 'user_owner'],
    });
    if (tasks.length === 0) {
      throw new NotFoundException(`User with ID ${id} has no tasks`);
    }
    return tasks;
  }

  async findByCollaborator(id: string): Promise<Task[]> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['teams', 'tasks'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const userId: string = user.user_id;

    const teamIds = user.teams.map((team) => team.team_id);

    const tasks = await this.taskRepository.find({
      where: {
        team: { team_id: In(teamIds) },
        collaborators: { user_id: userId },
      },
      relations: ['team', 'collaborators'],
    });
    if (tasks.length === 0) {
      throw new NotFoundException(`User with ID ${id} has no tasks`);
    }
    return tasks;
  }

  async findByTeam(teamId: string): Promise<Task[]> {
    const team = await this.teamRepository.findOne({
      where: { team_id: teamId },
      relations: [
        'tasks',
        'tasks.team',
        'tasks.user_owner',
        'tasks.collaborators',
      ],
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const tasks = team.tasks;
    if (tasks.length === 0) {
      throw new NotFoundException(`Team with ID ${teamId} has no tasks`);
    }
    return tasks;
  }

  async create(
    task: Partial<Task>,
    teamId: string,
    userOwnerId: string,
  ): Promise<Task> {
    const createdAt = new Date();
    task.created = createdAt.toLocaleString();

    const team = await this.teamRepository.findOneBy({ team_id: teamId });
    const userOwner = await this.userRepository.findOneBy({
      user_id: userOwnerId,
    });

    task.team = team;
    task.user_owner = userOwner;

    const newTask = this.taskRepository.create(task);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, task);
    const updatedTask = await this.taskRepository.findOneBy({ task_id: id });
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findOneBy({ task_id: id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskRepository.remove(task);
  }
}
