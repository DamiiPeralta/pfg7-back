import { Injectable, NotFoundException } from "@nestjs/common";
import { Team } from "./team.entity";
import { TeamRepository } from "./team.repository";

@Injectable()
export class TeamService {
  constructor(private readonly teamsRepository: TeamRepository) {}

  async getTeams(): Promise<Team[]> {
    return await this.teamsRepository.getTeams();
  }

  async getTeamById(id: string): Promise<Team> {
      return await this.teamsRepository.findTeamById(id);
  }

  async createTeam(user_Id: string, teamDto: Partial<Team>): Promise<Team> {
    const team = await this.teamsRepository.createTeam(user_Id, teamDto);
    return team;
  }

  async updateTeam(id: string, team: Partial<Team>): Promise<Team> {
    const existingTeam = await this.teamsRepository.findTeamById(id);
    Object.assign(existingTeam, team); // Update only provided fields
    return await this.teamsRepository.updateTeam(id, existingTeam);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.teamsRepository.deleteTeam(id);
  }
  async addUserToTeam(userId: string, teamId: string): Promise<Team> {
    return await this.teamsRepository.addUserToTeam(userId, teamId);
  }

  async joinTeam(userid: string, code: string) {
    return await this.teamsRepository.joinTeam(userid, code);
  }
    
}
