import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import {
  ChangePasswordDto,
  CredentialsDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from 'src/credentials/credentials.dto';
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

  async changePassword(body: ChangePasswordDto) {
    try {
      const { email, password, newPassword } = body;
      const user: User = await this.userService.getUserByEmail(email);

      if (!user) throw new NotFoundException('Invalid Credentials');

      const isPasswordValid = await bcrypt.compare(
        password,
        user.credentials.password,
      );
      if (!isPasswordValid)
        throw new BadRequestException('Invalid Credentials');

      user.credentials.password = await bcrypt.hash(newPassword, 10);
      console.log(user);
      await this.userService.updateUser(user.user_id, user);
      return 'Password changed successfully';
    } catch (error) {
      throw new BadGatewayException('Failed to change password');
    }
  }

  async forgotPassword(body: ForgotPasswordDto) {
    try {
            return ('Ruta no implementada')
/*       const user = await this.userService.getUserByEmail(body.email);
      if (!user) throw new NotFoundException('Invalid Credentials');

      const token = this.jwtService.sign({
        user_id: user.user_id,
        nickname: user.credentials.nickname,
      });
      let verificationLink = `http://localhost:3000/auth/resetPassword/${token}`;
      user.resetToken = token;

      try {
         await this.emailService.sendEmail({
          subjectEmail: 'Solicitud de cambio de contraseña',
          sendTo: user.credentials.email,
          template: 'changePassword',
          params: { name: user.name, link: verificationLink },
        }); 
        return ('Email sent. Check your email inbox to reset your password' + token);
      } catch (error) {
        throw new BadGatewayException('Failed to send Email');
      } */
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
  async resetPassword(newPassword: string, resetToken: string) {
    if (!(newPassword && resetToken))
      throw new NotFoundException('Missing fields');

    try {
      return ('Ruta no implementada')
      /* let jwtPayload = this.jwtService.verify(resetToken);
      let user = await this.userService.getUserById(jwtPayload.user_id);

      user.credentials.password = await bcrypt.hash(newPassword, 10);
      user.resetToken = null;
      await this.userService.updateUser(user.user_id, user);

      return 'Password changed successfully'; */
    } catch (error) {
      throw new BadGatewayException('Something went wrong');
    }
  }
}
