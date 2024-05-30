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

  async createUser(user: UserDto) {
    return await this.authRepository.createUser(user)
    /* const hashedPassword = await bcrypt.hash(user.password, 10);
           
        const dbUser = await this.userService.getUserByEmail(user.email)
        if (dbUser) {
            throw new BadRequestException("Email already exist");
        } 
    if (!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }
    const newUser = {
      ...user,
      password: hashedPassword,
    };
    this.userService.createUser(newUser);
    //this.userService.createUser(newUser, createdAt) //De esta forma se encontraba la linea de arriba.

    return { success: 'User created succesfully' }; */
  }

  async signIn(loginUserDto: LoginUserDto) {
    // Extraemos las credenciales del objeto UserDto
    const { email, password } = loginUserDto;
    let dbUser = await this.userService.getUserByEmail(email);
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
