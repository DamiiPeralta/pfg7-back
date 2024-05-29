import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "./team.entity";
import { TeamDto } from "./team.dto";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly userService: UserService
  ) {}

  async getTeams(): Promise<Team[]> {
    return await this.teamRepository.find();
  }

  async findTeamById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { team_id: id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async createTeam(user_Id:string,teamDto: TeamDto): Promise<Team> {
    let team = new Team();
    Object.assign(team, teamDto);
    const user = await this.userService.getUserById(user_Id);
    team.team_leader = user;
    const newTeam = this.teamRepository.create(teamDto);
    return await this.teamRepository.save(newTeam);
  }

  async updateTeam(id: string, teamDto: TeamDto): Promise<Team> {
    const team = await this.findTeamById(id);
    Object.assign(team, teamDto); // Update only provided fields
    return await this.teamRepository.save(team);
  }

  async deleteTeam(id: string): Promise<void> {
    const team = await this.findTeamById(id);
    await this.teamRepository.remove(team);
  }
}
