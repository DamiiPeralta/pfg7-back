import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "./team.entity";
import { TeamDto } from "./team.dto";

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find();
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { team_id: id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async create(teamDto: TeamDto): Promise<Team> {
    const newTeam = this.teamRepository.create(teamDto);
    return await this.teamRepository.save(newTeam);
  }

  async update(id: string, teamDto: TeamDto): Promise<Team> {
    const team = await this.findById(id);
    Object.assign(team, teamDto); // Update only provided fields
    return await this.teamRepository.save(team);
  }

  async delete(id: string): Promise<void> {
    const team = await this.findById(id);
    await this.teamRepository.remove(team);
  }
}
