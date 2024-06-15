import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  //@Roles(Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Doesn`t expect any parameters. Returns an array of User objects.',
  })
  async getUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }
  @Get('friends/:id')
   //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get a friends at user by Id',
    description:
      'Expects an UUID through Params. Returns a single User object.',
  })
  async getFriends(@Param('id') id: string) {
    return this.userService.searchFriends(id);
  }

  @Get(':id')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get a single user by Id',
    description:
      'Expects an UUID through Params. Returns a single User object.',
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

  @Delete(':id')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Deletes a user.',
    description:
      'Expects the UUID of the user to delete through Params. Returns a succes or failure message.',
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
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
  @Put(':id/restore')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Restore a user.',
    description:
      'Expects the UUID of the user to restore through Params. Returns a succes or failure message.',
  })
  async restoreUser(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.userService.restoreUser(id);
      return { message: 'User restore successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to restore user');
    }
  }

  @Post('/auth0')
  async createWithAuth0(@Body() user: any) {
    try {
      return await this.userService.createUserAuth0(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Put(':id')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Updates a user´s properties.',
    description:
      'Expects the UUID of the user to modify through Params and the properties to change through the Body. Returns the modified User object.',
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


}
