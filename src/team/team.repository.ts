import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "./team.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly userService: UserService
  ) {}

  async getTeams(): Promise<Team[]> {
    return await this.teamRepository.find({relations:['tasks', 'team_leader', 'team_users']});
  }

  async findTeamById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { team_id: id },relations:['tasks', 'team_leader', 'team_users'] });
    console.log(id)
    console.log(team)
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async createTeam(user_Id:string,teamDto: Partial<Team>): Promise<Team> {
    const team = new Team();
    Object.assign(team, teamDto);
    const createdAt = new Date();
    team.created_date = createdAt.toDateString();
    let user = await this.userService.getUserById(user_Id);
    team.team_leader = user;
    const newTeam = this.teamRepository.create(team);
    let userUpdated = user;
    userUpdated.teams.push(newTeam);
    this.userService.updateUser(user.user_id, userUpdated)
    return await this.teamRepository.save(newTeam);
  }

  async updateTeam(id: string, team: Partial<Team>): Promise<Team> {
    const upTeam = await this.findTeamById(id);
    Object.assign(upTeam, team); // Update only provided fields
    return await this.teamRepository.save(team);
  }

  async deleteTeam(id: string): Promise<void> {
    const team = await this.findTeamById(id);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    await this.teamRepository.softRemove(team);
  }
}
