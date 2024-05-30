import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getAllTask(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }

  async getTaskById(id: string): Promise<Task> {
    return await this.taskRepository.findById(id);
  }

  async getTaskByName(name: string): Promise<Task[]> {
    return await this.taskRepository.findByName(name);
  }

  async getTaskByUserOwner(id: string): Promise<Task[]> {
    return await this.taskRepository.findByUserOwner(id);
  }

  async getTaskByCollaborator(id: string): Promise<Task[]> {
    return await this.taskRepository.findByCollaborator(id);
  }

  async getTaskByTeam(id: string): Promise<Task[]> {
    return await this.taskRepository.findByTeam(id);
  }

  async createTask(
    task: Partial<Task>,
    teamId: string,
    userOwnerId: string,
  ): Promise<Task> {
    return await this.taskRepository.create(task, teamId, userOwnerId);
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    return await this.taskRepository.update(id, task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
