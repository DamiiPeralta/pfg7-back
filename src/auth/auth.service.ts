import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth/auth.repository';
import { LoginUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: Partial<User>) {
    return await this.userService.createUser(user)
  }

  async signIn(loginUserDto: Partial<User>) {
    try{
      const { email, password } = loginUserDto;
      const dbUser = await this.userService.getUserByEmail(email);
      if (!dbUser) {
        throw new BadRequestException('Invalid Credentials.');
      }

      const isPasswordValid = await bcrypt.compare(password, dbUser.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid Credentials.');
      }
      const userPayload = {
        sub: dbUser.user_id,
        id: dbUser.user_id,
        email: dbUser.email,
        //isAdmin: dbUser.isAdmin
        //roles: [dbUser.isAdmin ? Role.Admin : Role.User]
      };

      const token = this.jwtService.sign(userPayload);
      const nowLogin = new Date();
      dbUser.last_login = nowLogin.toDateString();
      dbUser.token = token;
      dbUser.status = true;
      await this.userService.updateUser(dbUser.user_id, dbUser);

      // Si las credenciales son válidas, retornamos un token de autenticación (simulado)
      return { success: 'User logged in successfully', token };
    }catch(error)
    {
      throw new BadRequestException('Invalid Credentials.');
    }
    
  }
}
