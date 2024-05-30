import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth/auth.repository';
import { UserDto } from '../user/user.dto';
import { LoginUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/roles.enum';
import { create } from 'domain';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: UserDto) {
    return await this.authRepository.signUp(user)
  }

  async signIn(loginUserDto: LoginUserDto) {
    return await this.authRepository.signIn(loginUserDto);
  }
}
