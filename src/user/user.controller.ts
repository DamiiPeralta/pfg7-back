import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Get()
  async getUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    try {
      return await this.usersService.getUserById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async createUser(@Body() userDto: UserDto) {
    const user = await this.usersService.createUser(userDto);
    const createdAt = new Date();
    delete user.password;
    return { user, createdAt };
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    try {
      return await this.usersService.updateUser(id, userDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.usersService.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
