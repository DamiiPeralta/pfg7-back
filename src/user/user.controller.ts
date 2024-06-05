import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users',
    description: 'Doesn`t expect any parameters. Returns an array of User objects.'
   })
  async getUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by Id',
    description: 'Expects an UUID through Params. Returns a single User object.'
   })
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

  @Put(':id')
  @ApiOperation({ summary: 'Updates a user´s properties.',
  description: 'Expects the UUID of the user to modify through Params and the properties to change through the Body. Returns the modified User object.'
 })
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
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
  @ApiOperation({ summary: 'Deletes a user.',
  description: 'Expects the UUID of the user to delete through Params. Returns a succes or failure message.'
 })
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
