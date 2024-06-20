import { BadGatewayException, ConflictException, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { Team } from 'src/team/team.entity';
import { TeamService } from 'src/team/team.service';
import { TeamRepository } from 'src/team/team.repository';
import { TaskRepository } from 'src/task/task.repository';
import { TaskService } from 'src/task/task.service';
import { Task } from 'src/task/task.entity';
import { Sprint } from 'src/sprint/sprint.entity';
import { SprintRepository } from 'src/sprint/sprint.repository';
import { SprintService } from 'src/sprint/sprint.service';
import { Credentials } from 'src/credentials/credentials.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/services/email/email.service';
import { Email } from 'src/email/providers/email/email';

@Module({
    imports: [TypeOrmModule.forFeature([User, Team, Task, Sprint, Credentials])],
    providers: [SeederService, UserRepository, UserService, AuthService, EmailService, Email, TeamRepository,TeamService, TaskRepository, TaskService, SprintRepository, SprintService],
    controllers: [SeederController],
})
export class SeederModule implements OnModuleInit{

    constructor (
        private readonly seederService: SeederService,
        private readonly taskService: TaskService,
        private readonly userService: UserService,
    ) {}

    async onModuleInit() {
      try {
        const admin = await this.userService.getUserByNickname('admin');
        if (admin) return console.log('Admin data already seeded');
        try {
          console.log('Seeding admin...');
          await this.seederService.seedAdmin();
          console.log('Admin seeded succesfuly!')
        } catch (error) {
          
          throw new BadGatewayException('Failed to seed Admin data');
        }
      } catch (error) {
        throw new BadGatewayException('Failed to seed Admin data');
      }
      /* try {
        const dbTask = await this.taskService.getAllTask();
        if(dbTask.length > 0) return console.log('Preload data already seeded');
        try {
          console.log('Seeding users...');
          await this.seederService.seedUsers();
          console.log('Users seeded succesfuly!')
        } catch (error) {
          throw new ConflictException('Failed to seed users');
        }
        try {
          console.log('Seeding teams...')
          await this.seederService.seedTeams();
          console.log('Teams seeded succesfuly!')
        } catch (error) {
          throw new ConflictException('Failed to seed teams');
        }
        try {
          console.log('Seeding tasks...')
          await this.seederService.seedTasks();
          console.log('Tasks seeded succesfuly!')
        } catch (error) {
          throw new ConflictException('Failed to seed tasks');
        }
        
      } catch (error) {
        throw new ConflictException('Failed to seed preload data');
      } */
    }  
}
