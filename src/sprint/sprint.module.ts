import { Module } from '@nestjs/common';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/task.entity';
import { Team } from 'src/team/team.entity';
import { TeamRepository } from 'src/team/team.repository';
import { SprintRepository } from './sprint.repository';
import { User } from 'src/user/user.entity';
import { TaskService } from 'src/task/task.service';
import { TaskRepository } from 'src/task/task.repository';
import { TeamService } from 'src/team/team.service';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { Sprint } from './sprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Team, Sprint])],
  providers: [SprintService, SprintRepository, TaskService, TaskRepository,TeamService,TeamRepository, UserService,UserRepository],
  controllers: [SprintController],
})
export class SprintModule {}

