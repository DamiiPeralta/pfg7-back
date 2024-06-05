import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/user.dto';
import { CreateUserDto } from '../user/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('auth')
@ApiTags('Auth')
export class AuthController { //Mover logica para repository.
  constructor(
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(AuthController.name);
  @Post('signup')
  @ApiOperation({ summary: 'Create a new user.',
  description: 'Expects all of the properties of the user through the Body. Returns the created User object.'
 })
  async signUp(@Body() user: CreateUserDto) {
    try {
      return await this.authService.signUp(user);
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
  @Post('signin')
  @ApiOperation({ summary: 'Logs in an existing user to create Token.',
  description: 'Expects the credentials of the user, email and password, through the Body. Returns a status message, the token and the User object.'
 })
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
