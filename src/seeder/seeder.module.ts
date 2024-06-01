import { ConflictException, Module, OnModuleInit } from '@nestjs/common';
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

@Module({
    imports: [TypeOrmModule.forFeature([User, Team, Task])],
    providers: [SeederService, UserRepository, UserService, TeamRepository,TeamService, TaskRepository, TaskService],
    controllers: [SeederController],
})
export class SeederModule implements OnModuleInit{

    constructor (
        private readonly seederService: SeederService,
    ) {}

    async onModuleInit() {
      //try {
      //  try {
      //    console.log('Seeding users...');
      //    await this.seederService.seedUsers();
      //    console.log('Users seeded succesfuly!')
      //  } catch (error) {
      //    throw new ConflictException('Failed to seed users');
      //  }
      //  try {
      //    console.log('Seeding teams...')
      //    await this.seederService.seedTeams();
      //    console.log('Teams seeded succesfuly!')
      //  } catch (error) {
      //    throw new ConflictException('Failed to seed teams');
      //  }
      //  try {
      //    console.log('Seeding tasks...')
      //    await this.seederService.seedTasks();
      //    console.log('Tasks seeded succesfuly!')
      //  } catch (error) {
      //    throw new ConflictException('Failed to seed tasks');
      //  }
      //  
      //} catch (error) {
      //  throw new ConflictException('Failed to seed preload data');
      //}
    }
}
