import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Team } from './team.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async getTeams(): Promise<Team[]> {
    return await this.teamRepository.find({
      relations: ['tasks', 'team_leader', 'team_users', 'sprints'],
      select: {
        team_id: true,
        team_name: true,
        description: true,
        invitation_code: true,
        tasks: {
          task_id: true,
          name: true,
          description: true,
        },
        team_leader: {
          user_id: true,
          name: true,
        },
        team_users: {
          user_id: true,
          name: true,
        },
        sprints: {
          sprint_id: true,
          name: true,
        },
      },
    });
  }

  async findTeamById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { team_id: id },
      relations: ['tasks', 'team_leader', 'team_users', 'sprints'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async createTeam(user_Id: string, teamDto: Partial<Team>): Promise<Team> {
    let team: Team;
    let uniqueCodeGenerated = false;

    while (!uniqueCodeGenerated) {
      const invitation_code = uuidv4();
      const existingTeam = await this.teamRepository.findOne({
        where: { invitation_code },
      });

      if (!existingTeam) {
        uniqueCodeGenerated = true;
        team = new Team();
        Object.assign(team, teamDto);
        const createdAt = new Date();
        team.created_date = createdAt.toDateString();
        team.invitation_code = invitation_code;

        const user = await this.userRepository.findOne({
          where: { user_id: user_Id },
        });
        if (!user) {
          throw new NotFoundException(`User with ID ${user_Id} not found`);
        }

        if (!user.teams) {
          user.teams = [];
        }
        user.teams.push(team);

        await this.userService.updateUser(user.user_id, user);

        return await this.teamRepository.save(team);
      }
    }
  }

  async updateTeam(id: string, team: Partial<Team>): Promise<Team> {
    const upTeam = await this.findTeamById(id);
    Object.assign(upTeam, team);
    return await this.teamRepository.save(team);
  }

  async deleteTeam(id: string): Promise<void> {
    const team = await this.findTeamById(id);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    await this.teamRepository.softRemove(team);
  }

  async addUserToTeam(userId: string, teamId: string): Promise<Team> {
    try {
      const team = await this.findTeamById(teamId);
      const user = await this.userService.getUserById(userId);
      if (!team || !user) {
        throw new NotFoundException(`Team or User not found`);
      }

      const userExistsInTeam = team.team_users.some(
        (teamUser) => teamUser.user_id === userId,
      );
      if (userExistsInTeam) {
        throw new ConflictException(`User ${userId} is already in the team`);
      }

      team.team_users.push(user);
      return await this.teamRepository.save(team);
    } catch (error) {
      throw error;
    }
  }
  async removeUserFromTeam(userId: string, teamId: string): Promise<Team> {
    const team = await this.findTeamById(teamId);
    const user = await this.userService.getUserById(userId);
    if (!team || !user) {
      throw new NotFoundException(`Team or User not found`);
    }

    team.team_users = team.team_users.filter(
      (teamUser) => teamUser.user_id !== userId,
    );
    return await this.teamRepository.save(team);
  }

  async updateTeamLeader(teamId: string, newLeaderId: string): Promise<Team> {
    const team = await this.findTeamById(teamId);
    const newLeader = await this.userService.getUserById(newLeaderId);
    if (!team || !newLeader) {
      throw new NotFoundException(`Team or User not found`);
    }

    team.team_leader = newLeader;

    return await this.teamRepository.save(team);
  }
  async findTeamsByName(name: string): Promise<Team[]> {
    return await this.teamRepository.find({
      where: { team_name: Like(`%${name}%`) },
      relations: ['tasks', 'team_leader', 'team_users', 'sprints'],
    });
  }

  async getUsersByTeam(teamId: string): Promise<User[]> {
    const team = await this.findTeamById(teamId);
    return team.team_users;
  }

  async getTeamByCode(code: string) {
    const team = await this.teamRepository.findOne({
      where: { invitation_code: code },
      relations: ['team_users'],
    });
    if (!team) {
      throw new NotFoundException(`Team with code ${code} not found`);
    }
    return team;
  }

  async joinTeam(userid: string, code: string) {
    const existingUser = await this.userService.getUserById(userid);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userid} not found`);
    }

    const team = await this.getTeamByCode(code);
    if (!team) {
      throw new NotFoundException(`Team with code ${code} not found`);
    }

    if (team.team_users.find((member) => member.user_id === userid)) {
      throw new BadRequestException(
        `User with ID ${userid} is already a member of the team`,
      );
    }

    team.team_users.push(existingUser);
    await this.teamRepository.save(team);

    return team;
  }

  getTeamsByLeaderId(leaderId: string): Promise<Team[]> {
    const teams = this.teamRepository.find({
      where: { team_leader: { user_id: leaderId } },
    });
    if (!teams) {
      throw new NotFoundException(`Teams with leader ID ${leaderId} not found`);
    }
    return teams;
  }

  async getUserTeams(userId: string): Promise<any> {
    try {
      const leaderTeams = await this.getTeamsByLeaderId(userId);

      const user = await this.userRepository.findOne({
        where: { user_id: userId },
        relations: ['teams'], // Assuming 'teams' is a relation in your user entity
      });
      const allTeams = user.teams;

      const collaboratorTeams = allTeams.filter(
        (team: Team) =>
          !leaderTeams.some(
            (leaderTeam: Team) => leaderTeam.team_id === team.team_id,
          ),
      );
      const response = {
        leaderTeams,
        collaboratorTeams,
      };

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user teams');
    }
  }

  async getNameByTeam(id: string) {
    const team = await this.teamRepository.findOne({
      where: { team_id: id },
      relations: ['team_users'],
      select: {
        team_id: true,
        team_name: true,
        team_users: {
          user_id: true,
          name: true,
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }
}
