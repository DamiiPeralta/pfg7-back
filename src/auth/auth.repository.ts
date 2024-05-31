import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginUserDto: Partial<User>){
    const { email, password } = loginUserDto;
    const dbUser = await this.userRepository.getUserByEmail(email);
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
  }
}
