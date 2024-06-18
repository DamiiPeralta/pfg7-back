import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/user.dto';
import { CreateUserDto } from '../user/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  CredentialsDto,
  ForgotPasswordDto,
} from 'src/credentials/credentials.dto';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);
  @Post('signup')
  @ApiOperation({
    summary: 'Create a new user.',
    description:
      'Expects all of the properties of the user through the Body. Returns the created User object.',
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
  @ApiOperation({
    summary: 'Logs in an existing user to create Token.',
    description:
      'Expects the credentials of the user, email and password, through the Body. Returns a status message, the token and the User object.',
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

  @Put('changePassword')
  @ApiOperation({
    summary: 'Changes the user´s password.',
    description:
      'Expects the email, current password and new password of the user through the Body. Returns a status message.',
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      return await this.authService.changePassword(changePasswordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('forgotPassword')
  @ApiOperation({
    summary: 'Blablabla',
    description:
      'Accesible from authorized link. Returns a status message.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      return "No implementado todavia"
      return await this.authService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
