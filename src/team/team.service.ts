import { Injectable, NotFoundException } from "@nestjs/common";
import { Team } from "./team.entity";
import { TeamsRepository } from "./team.repository";
import { TeamDto } from "./team.dto";

@Injectable()
export class TeamsService {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async getAllTeams(): Promise<Team[]> {
    return await this.teamsRepository.findAll();
  }

  async getTeamById(id: string): Promise<Team> {
    return await this.teamsRepository.findById(id);
  }

  async createTeam(teamDto: TeamDto): Promise<Team> {
    return await this.teamsRepository.create(teamDto);
  }

  async updateTeam(id: string, teamDto: TeamDto): Promise<Team> {
    const existingTeam = await this.teamsRepository.findById(id);
    Object.assign(existingTeam, teamDto); // Update only provided fields
    return await this.teamsRepository.update(id, existingTeam);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.teamsRepository.delete(id);
  }
}
