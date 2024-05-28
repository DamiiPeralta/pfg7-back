import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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

  async create(task: Partial<Task>): Promise<Task> {
    const createdAt = new Date();
    task.created = createdAt.toLocaleString();
    const newTask = this.taskRepository.create(task);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, task);
    const updatetask = await this.taskRepository.findOneBy({ task_id: id });
    return updatetask;
  }

  async delete(id: string): Promise<void> {
    const task = await this.findById(id);
    await this.taskRepository.remove(task);
  }
}
