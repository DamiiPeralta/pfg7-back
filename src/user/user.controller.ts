import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  @Post()
  async createUser(@Body() userDto: UserDto) {
    try {
      const user = await this.userService.createUser(userDto);
      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: Partial<User>) {
    try {
      const upUser = await this.userService.updateUser(id, user);
      if (!upUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return upUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await this.userService.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
