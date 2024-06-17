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
import { Auth0Dto, CreateUserDto } from './user.dto';
import { Credentials } from 'src/credentials/credentials.entity';
import { v4 as uuidv4 } from 'uuid';
import { Team } from 'src/team/team.entity';
import { Role } from 'src/roles/roles.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<Partial<User[]>> {
    try {
      const users = await this.userRepository.find({
        relations: ['tasks', 'teams', 'credentials'],
        select: {
          user_id: true,
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
  async getUserByEmailCreate(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { credentials: { email: email } },
      });
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }
  async getUserByNickname(nickname: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { credentials: { nickname: nickname } },
      });
    } catch (error) {
      throw new NotFoundException(`User with nickname ${nickname} not found`);
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const emailExist = await this.getUserByEmailCreate(createUserDto.email);

    if (emailExist) {
      throw new BadRequestException('That email is already registered');
    }

    const nicknameExist = await this.getUserByNickname(createUserDto.nickname);
    if (nicknameExist) {
      throw new BadRequestException('That nickname is already registered');
    }

    const userToCreate: User = new User();
    const credentials: Credentials = new Credentials();
    credentials.email = createUserDto.email;
    credentials.password = await bcrypt.hash(createUserDto.password, 10);
    credentials.nickname = createUserDto.nickname;
    userToCreate.created = new Date().toISOString();
    userToCreate.credentials = credentials;
    userToCreate.name = createUserDto.name;

    try {
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
  async createWithAuth0(user: Auth0Dto) {
    const { email, name, picture } = user;

    const existingUser = await this.userRepository.findOne({
      where: { credentials: { email } },
      relations: ['credentials'],
    });

    if (existingUser) {
      return this.updateExistingUser(existingUser, name, picture);
    } else {
      return this.createNewUser(email, name, picture);
    }
  }

  private async updateExistingUser(
    existingUser: User,
    name: string,
    picture: string,
  ) {
    try {
      existingUser.name = name;
      existingUser.profilePicture = picture;
      existingUser.last_login = new Date().toISOString();

      await this.userRepository.save(existingUser);

      const userPayload = {
        sub: existingUser.user_id,
        id: existingUser.user_id,
        email: existingUser.credentials.email,
        isAdmin: existingUser.is_admin,
        roles: [existingUser.is_admin ? Role.Admin : Role.User],
      };

      const token = this.jwtService.sign(userPayload);
      existingUser.token = token;
      existingUser.status = true;
      await this.userRepository.save(existingUser);

      return { success: 'User logged in successfully', token };
    } catch (error) {
      console.error('Error while updating user:', error);
      throw new InternalServerErrorException(
        'Failed to update user',
        error.message,
      );
    }
  }

  private async createNewUser(email: string, name: string, picture: string) {
    try {
      const userToCreate = new User();
      const credentials = new Credentials();
      credentials.email = email;

      let nickname = name.split(' ').join('');
      let isNicknameUnique = false;
      while (!isNicknameUnique) {
        const existingUser = await this.credentialsRepository.findOne({
          where: { nickname },
        });
        if (existingUser) {
          nickname = `${nickname}${Math.floor(Math.random() * 10000)}`;
        } else {
          isNicknameUnique = true;
        }
      }
      credentials.nickname = nickname;

      const password = uuidv4();
      credentials.password = await bcrypt.hash(password, 10);

      userToCreate.created = new Date().toISOString();
      userToCreate.credentials = credentials;
      userToCreate.name = name;
      userToCreate.profilePicture = picture;

      const newUser = this.userRepository.create(userToCreate);
      await this.userRepository.save(newUser);

      const userPayload = {
        sub: newUser.user_id,
        id: newUser.user_id,
        email: newUser.credentials.email,
        isAdmin: newUser.is_admin,
        roles: [newUser.is_admin ? Role.Admin : Role.User],
      };

      const token = this.jwtService.sign(userPayload);
      newUser.last_login = new Date().toISOString();
      newUser.token = token;
      newUser.status = true;
      await this.userRepository.save(newUser);

      return { success: 'User logged in successfully', token };
    } catch (error) {
      console.error('Error while creating user:', error);
      throw new InternalServerErrorException(
        'Failed to create user',
        error.message,
      );
    }
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

  async searchFriends(id: string): Promise<User[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
        relations: ['teams'],
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const teams = await this.teamRepository.find({
        where: [{ team_leader: user }, { team_users: user }],
        relations: ['team_leader', 'team_users'],
      });

      // Crear un array de usuarios únicos
      const usersSet = new Set<User>();

      // Agrega a los líderes y miembros de los equipos al conjunto
      teams.forEach((team) => {
        usersSet.add(team.team_leader);
        team.team_users.forEach((member) => usersSet.add(member));
      });

      // Convertir el conjunto a un array
      const usersArray = Array.from(usersSet);

      return usersArray;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to search friends');
    }
  }
}
