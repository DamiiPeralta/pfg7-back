import { Injectable, NotFoundException } from "@nestjs/common";
import { Team } from "./team.entity";
import { TeamRepository } from "./team.repository";
import { TeamDto } from "./team.dto";

@Injectable()
export class TeamService {
  constructor(private readonly teamsRepository: TeamRepository) {}

  async getTeams(): Promise<Team[]> {
    return await this.teamsRepository.getTeams();
  }

  async getTeamById(id: string): Promise<Team> {
    return await this.teamsRepository.findTeamById(id);
  }

  async createTeam(teamDto: TeamDto): Promise<Team> {
    const team = await this.teamsRepository.createTeam(teamDto);
    return team;
  }

  async updateTeam(id: string, teamDto: TeamDto): Promise<Team> {
    const existingTeam = await this.teamsRepository.findTeamById(id);
    Object.assign(existingTeam, teamDto); // Update only provided fields
    return await this.teamsRepository.updateTeam(id, existingTeam);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.teamsRepository.deleteTeam(id);
  }
}
