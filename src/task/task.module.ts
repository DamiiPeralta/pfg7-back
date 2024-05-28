import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService, TaskRepository],
  controllers: [TaskController],
})
export class TaskModule {}
