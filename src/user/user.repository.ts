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
import { CreateUserDto } from './user.dto';
import { Credentials } from 'src/credentials/credentials.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
  ) {}

  async getUsers(): Promise<Partial<User[]>> {
    try {
      const users = await this.userRepository.find({
        relations: ['tasks', 'teams', 'credentials'],
        select: {
          name: true,
          created: true,
          last_login: true,
          status: true,
          profilePicture: true,
          is_admin: true,
          tasks: {
            name: true,
            description: true,
          },
          teams: {
            team_name: true,
          },
          credentials: {
            email: true,
            nickname: true,
          },
        },
      });
      //const usersWithoutPassword:any[] = [];
      //  users.forEach(user => {
      //      const { password, ...userWithoutPassword } = user;
      //      usersWithoutPassword.push(userWithoutPassword);
      //  });
      //return usersWithoutPassword;
      return users;
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

  async getUserByEmail(email: string): Promise<User> {
    try {
      const credential = await this.credentialsRepository.findOne({
        where: { email: email },
        relations: ['user'],
      });
      if (!credential) {
        throw new NotFoundException(`User with Email ${email} not found`);
      }
      const userCred = credential.user;
      const user = await this.userRepository.findOne({
        where: { user_id: userCred.user_id },
        relations: ['credentials'],
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }
  async getUserByNickname(nickname: string): Promise<User> {
    try {
      const credential = await this.credentialsRepository.findOne({
        where: { nickname: nickname },
        relations: ['user'],
      });
      if (!credential) {
        throw new NotFoundException(`User with nickname ${nickname} not found`);
      }
      const userCred = credential.user;
      const user = await this.userRepository.findOne({
        where: { user_id: userCred.user_id },
        relations: ['credentials'],
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userToCreate: User = new User();
      const credentials: Credentials = new Credentials();
      credentials.email = createUserDto.email;
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      credentials.password = hashedPassword;
      credentials.nickname = createUserDto.nickname;
      const createdAt = new Date();
      userToCreate.created = createdAt.toDateString();
      userToCreate.credentials = credentials;
      userToCreate.name = createUserDto.name;

      const newUser = this.userRepository.create(userToCreate);
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
  async createWithAuth0(user: any): Promise<User> {
    const { email, nickname, name, picture } = user;

    const userExist = await this.userRepository.findOne({
      where: { credentials: { email: email } }, // Utiliza la relación credentials
      relations: ['credentials'],
    });

    if (!userExist) {
      try {
        const userToCreate = new User();
        const credentials = new Credentials();
        credentials.email = email;
        credentials.nickname = nickname;
        const password = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        credentials.password = hashedPassword;
        userToCreate.created = new Date().toDateString();
        userToCreate.credentials = credentials;
        userToCreate.name = name;
        userToCreate.profilePicture = picture;

        const newUser = this.userRepository.create(userToCreate);
        return await this.userRepository.save(newUser);
      } catch (error) {
        console.error('Error while creating user:', error);
        throw new InternalServerErrorException(
          'Failed to create user',
          error.message,
        );
      }
    }
    return userExist;
  }

  async restoreUser(id: string): Promise<User> {
    try {
      const softDeletedUser = await this.userRepository.findOne({
        withDeleted: true,
        where: { user_id: id },
      });
      if (!softDeletedUser) {
        throw new NotFoundException(
          `Soft-deleted user with ID ${id} not found`,
        );
      }
      await this.userRepository.recover(softDeletedUser);
      return softDeletedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to restore user');
    }
  }
}
