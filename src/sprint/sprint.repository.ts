import { Repository } from 'typeorm';
import { Sprint } from './sprint.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamRepository } from 'src/team/team.repository';
import { Team } from 'src/team/team.entity';

@Injectable()
export class SprintRepository {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    private readonly teamRepository: TeamRepository,
  ) {}

  async findAll(): Promise<Sprint[]> {
    try {
      const sprints: Sprint[] = await this.sprintRepository.find({
        relations: {
          team: true,
          tasks: true,
        },
      });
      if (sprints.length === 0) {
        return [];
      }
      return sprints;
    } catch (error) {
      throw new Error(`Failed to fetch sprints: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({
      where: { sprint_id: id },
      relations: {
        team: true,
        tasks: true,
      },
    });
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  async findByTeam(teamId: string): Promise<Sprint[]> {
    try {
      const team = await this.teamRepository.findTeamById(teamId);
      console.log(team);
      
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }

      const sprints = team.sprints;
      console.log(sprints);
      
      if (sprints.length === 0) {
        throw new NotFoundException(`Team with ID ${teamId} has no sprints`);
      }
      console.log(3);
      
      return sprints;
    } catch (error) {
      console.error(`Error in findByTeam: ${error.message}`);
      throw error;
    }
  }

  async create(sprint: Partial<Sprint>, team: Team): Promise<Sprint> {
    try {
      sprint.team = team;
      

      const createdAt = new Date();
      sprint.created = createdAt.toLocaleString();

      const newSprint = this.sprintRepository.create(sprint);

      await this.sprintRepository.save(newSprint);

      const sprintCreated = this.sprintRepository.findOne({
        where: { sprint_id: newSprint.sprint_id },
        relations: ['team'],
      });
      return sprintCreated;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create sprint');
    }
  }

  async update(id: string, sprint: Partial<Sprint>): Promise<Sprint> {
    try {
      await this.sprintRepository.update(id, sprint);

      const updatedSprint = await this.sprintRepository.findOneBy({ sprint_id: id });

      if (!updatedSprint) {
        throw new Error(`Sprint with ID ${id} not found after update`);
      }

      return updatedSprint;
    } catch (error) {
      throw new Error(`Failed to update sprint: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const sprint = await this.sprintRepository.findOneBy({ sprint_id: id });
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    await this.sprintRepository.softRemove(sprint);
  }
}
