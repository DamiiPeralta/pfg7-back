import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
    const user = await this.userService.getUserById(user_Id);
    team.team_leader = user;
    const newTeam = this.teamRepository.create(team);
    const userUpdated = user;
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

  async addUserToTeam(userId: string, teamId: string): Promise<Team> {
    try {
      const team = await this.findTeamById(teamId);
      const user = await this.userService.getUserById(userId);
      if (!team || !user) {
        throw new NotFoundException(`Team or User not found`);
      }

      // Verificar si el usuario ya está en el equipo
      const userExistsInTeam = team.team_users.some(teamUser => teamUser.user_id === userId);
      if (userExistsInTeam) {
        // Si el usuario ya está en el equipo, lanzar una excepción de conflicto
        throw new ConflictException(`User ${userId} is already in the team`);
      }

      // Si el usuario no está en el equipo, agregarlo
      team.team_users.push(user);
      return await this.teamRepository.save(team);
    } catch (error) {
      throw error; // Relanzar el error para que sea manejado por el controlador
    }
  }
}
