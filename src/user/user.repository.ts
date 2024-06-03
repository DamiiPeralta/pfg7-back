import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise <Partial<User[]>> {
    try {
      const users =  await this.userRepository.find({ relations: ['tasks', 'teams'] });
      const usersWithoutPassword:any[] = [];
        users.forEach(user => {
            const { password, ...userWithoutPassword } = user;
            usersWithoutPassword.push(userWithoutPassword);
        });
      return usersWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
        relations: ['tasks', 'teams'],
      });
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

  async getUserByEmail(email: string): Promise<Partial<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        relations: ['tasks', 'teams'],
      });
      if (!user) {
        throw new NotFoundException(`User with Email ${email} not found`);
      } 
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }
  async createUser(userDto: Partial<User>): Promise<User> {
    try {
      const user: Partial<User> = userDto;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      const createdAt = new Date();
      user.created = createdAt.toDateString();
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
      const upUser = await this.findUserById(id);
      Object.assign(upUser, user); // Update only provided fields
      return await this.userRepository.save(upUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.findUserById(id);
      await this.userRepository.softRemove(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
