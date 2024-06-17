import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { CredentialsDto } from 'src/credentials/credentials.dto';
import { Role } from 'src/roles/roles.enum';
import { EmailService } from 'src/email/services/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);

    try {
      await this.emailService.sendEmail({
        from: 'easytask@ethereal.email',
        subjectEmail: '¡Cuenta creada con éxito!',
        sendTo: user.credentials.email,
        template: 'signup',
        params: { name: user.name },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to send email, user created successfully',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return { success: `User ${createUserDto.name} created in successfully` };
  }

  async signIn(credentialsDto: CredentialsDto) {
    try {
      let dbUser: User;
      const { nickname, email, password } = credentialsDto;
      if (!email && !nickname) {
        throw new BadRequestException('Usuario con ese email y nickname');
      }
      if (email != null) {
        dbUser = await this.userService.getUserByEmail(email);
      } else if (nickname != null) {
        dbUser = await this.userService.getUserByNickname(nickname);
      }

      if (!dbUser) {
        throw new BadRequestException('Invalid Credentials.');
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        dbUser.credentials.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid Credentials.');
      }
      const userPayload = {
        sub: dbUser.user_id,
        id: dbUser.user_id,
        email: dbUser.credentials.email,
        isAdmin: dbUser.is_admin,
        roles: [dbUser.is_admin ? Role.Admin : Role.User],
      };

      const token = this.jwtService.sign(userPayload);
      const nowLogin = new Date();
      dbUser.last_login = nowLogin.toDateString();
      dbUser.token = token;
      dbUser.status = true;
      await this.userService.updateUser(dbUser.user_id, dbUser);

      // Si las credenciales son válidas, retornamos un token de autenticación (simulado)
      return token;
    } catch (error) {
      throw new BadRequestException('Invalid Credentials.');
    }
  }
}
