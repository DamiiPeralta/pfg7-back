import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { CredentialsDto } from 'src/credentials/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async signIn(credentialsDto: CredentialsDto) {
    try{
      let dbUser;
      const { nickname, email, password } = credentialsDto;
      if(!email && !nickname){
        throw new BadRequestException('Usuario con ese email y nickname');
      }
      if(email != null)
        {
          dbUser = await this.userService.getUserByEmail(email);
        }
      else if(nickname != null){
         dbUser = await this.userService.getUserByNickname(nickname);
        }
      
    
      if (!dbUser) {
        throw new BadRequestException('Usuario con ese email no existe');
      }
      const isPasswordValid = await bcrypt.compare(password, dbUser.credentials.password);
      if (!isPasswordValid) {
        throw new BadRequestException('password mal.');
      }
      const userPayload = {
        sub: dbUser.user_id,
        id: dbUser.user_id,
        email: dbUser.credentials.email,
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
