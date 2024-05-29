import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './loginUserDto.dto';
import { UserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { ApiTags } from '@nestjs/swagger';
@Controller('auth')
@ApiTags('Auth')
export class AuthController { //Mover logica para repository.
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  private readonly logger = new Logger(AuthController.name);
  @Post('signup')
  createUser(@Body() user: UserDto) {
    const createdAt = new Date();

    this.authService.createUser(user, createdAt.toString());
    const userWithoutPassword = user;
    delete userWithoutPassword.password;
    return { userWithoutPassword, createdAt: createdAt };
  }
  @Post('signin')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    try {
      const token = await this.authService.signIn(loginUserDto);
      return { token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Propagar excepción BadRequestException sin modificar
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Si el error proviene de una respuesta HTTP (por ejemplo, una solicitud a un servicio externo)
        this.logger.error(
          `External request error: ${error.response.data.message}`,
        );
        throw new InternalServerErrorException('Internal server error.');
      } else {
        // Otros errores no manejados
        this.logger.error(`Error no manejado: ${error.message}`);
        throw new InternalServerErrorException('Internal server error.');
      }
    }
  }
}
