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
import { CredentialsDto } from 'src/credentials/credentials.dto';
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
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.signUp(createUserDto);
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
  async signIn(@Body() credentialsDto: CredentialsDto) {
    try {
      const token = await this.authService.signIn(credentialsDto);
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
