import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as dataUsers from '../utils/dataUsers.json'
import * as dataTeams from '../utils/dataTeams.json'
import * as dataTasks from '../utils/dataTasks.json'
import { CreateUserDto } from 'src/user/user.dto';
import { TeamService } from 'src/team/team.service';
import { CreateTeamDto } from 'src/team/team.dto';
import { TaskService } from 'src/task/task.service';
import { CreateTaskDto } from 'src/task/task.dto';

@Injectable()
export class SeederService {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly taskService: TaskService,

  ){}
  async seedUsers() {
    try {
      const dbUsers = await this.userService.getAllUsers();
      if(dbUsers.length > 0) {
        for (const dbUser of dbUsers) {
          for (const dataUser of dataUsers) {
            if(dbUser.email === dataUser.email) {
              return 'Users already seeded';
            }
          }
        }
      }
      for (const element of dataUsers) {
        const user = new CreateUserDto();
        user.name = element.name;
        user.nickname = element.nickname;
        user.email = element.email;
        user.password = element.password;
        await this.userService.createUser(user);
        
      }
      return 'Users seeded successfully';
      
    } catch (error) {
      throw new BadGatewayException('Failed to seed users');
    }
  }
  async seedTeams(){
    try {
      const dbUsers = await this.userService.getAllUsers();
      if(!dbUsers) throw new NotFoundException('No users found');
      const dbTeams = await this.teamService.getTeams();
      
      if(dbTeams.length > 0) {
        for (const dbTeam of dbTeams) {
          for (const dataTeam of dataTeams) {
            if(dbTeam.team_name === dataTeam.team_name) {
              return 'Teams already seeded';
            }
          }
        }
      }

      for (const element of dataTeams) {
        const teamLeader = await this.userService.getUserByEmail(element.leader_email);
        if(!teamLeader) throw new BadRequestException('Leader not found');

        const team = new CreateTeamDto();
        team.team_name = element.team_name;
        team.description = element.description;
        team.created_date = element.created_date;
        team.finish_date = element.finish_date;
        await this.teamService.createTeam(teamLeader.user_id, team);
      }
      return 'Teams seeded successfully';
      
    } catch (error) {
      throw new BadGatewayException('Failed to seed Teams');
    }
  }
  async seedTasks(){
    try {
      const dbTeams = await this.teamService.getTeams();
      if(!dbTeams) throw new NotFoundException('No teams found');
      const dbTasks = await this.taskService.getAllTask();
      
      if(dbTasks.length > 0) {
        for (const dbTask of dbTasks) {
          for (const dataTask of dataTasks) {
            if(dbTask.name === dataTask.name) {
              return 'Tasks already seeded';
            }
          }
        }
      }

      for (const element of dataTasks) {
        //task - team id - user owner id
        const team = dbTeams.find(team => team.team_name === element.team_name);
        if(!team) throw new BadRequestException('Team not found');

        const userOwner = await this.userService.getUserByEmail(element.owner_email);

        const task = new CreateTaskDto();
        task.name = element.name;
        task.description = element.description;
        task.status = element.status;
        task.priority = element.priority;
        task.story_points = element.story_points;
        await this.taskService.createTask(task, team.team_id);
        
      }
      return 'Tasks seeded successfully';
      
    } catch (error) {
      throw new BadGatewayException('Failed to seed Tasks');
    }
  }
}
