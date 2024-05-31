import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { User } from 'src/user/user.entity';
import { Team } from 'src/team/team.entity';
import { TeamService } from 'src/team/team.service';
import { TeamRepository } from 'src/team/team.repository';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Team])],
  providers: [TaskService, TaskRepository,TeamService,TeamRepository, UserService,UserRepository],
  controllers: [TaskController],
})
export class TaskModule {}
