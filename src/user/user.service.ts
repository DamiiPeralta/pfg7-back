import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.usersRepository.getUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }


  async createUser(userDto: UserDto): Promise<User> {
    try {
      return await this.usersRepository.createUser(userDto);
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findUserById(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      Object.assign(existingUser, user); // Update only provided fields
      return await this.usersRepository.updateUser(id, existingUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const user = await this.usersRepository.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return await this.usersRepository.deleteUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
