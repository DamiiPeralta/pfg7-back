import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SprintRepository } from './sprint.repository';
import { Sprint } from './sprint.entity';
import { TeamService } from 'src/team/team.service';

@Injectable()
export class SprintService {
  constructor(
    private readonly sprintRepository: SprintRepository,
    private readonly teamService: TeamService,
  ) {}

  async getAllSprints(): Promise<Sprint[]> {
    try {
      return await this.sprintRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve sprints');
    }
  }

  async getSprintById(id: string): Promise<Sprint> {
    try {
      const sprint = await this.sprintRepository.findById(id);
      if (!sprint) {
        throw new NotFoundException(`Sprint with ID ${id} not found`);
      }
      return sprint;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve sprint');
    }
  }

  async getTaskByTeam(id: string): Promise<Sprint[]> {
    try {
      return await this.sprintRepository.findByTeam(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve sprints by team',
      );
    }
  }

  async createSprint(sprint: Partial<Sprint>, teamId: string): Promise<Sprint> {
    const team = await this.teamService.getTeamById(teamId);
    if (team === undefined) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    try {
      return await this.sprintRepository.create(sprint, team);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create sprint');
    }
  }

  async updateSprint(id: string, sprint: Partial<Sprint>): Promise<Sprint> {
    try {
      const updatedSprint = await this.sprintRepository.update(id, sprint);
      if (!updatedSprint) {
        throw new NotFoundException(`Sprint with ID ${id} not found`);
      }
      return updatedSprint;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update sprint');
    }
  }

  async deleteSprint(id: string): Promise<void> {
    try {
      await this.sprintRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete sprint');
    }
  }
}
