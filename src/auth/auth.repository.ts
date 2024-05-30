import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LoginUserDto, UserDto } from 'src/user/user.dto';
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

  async signUp(user: UserDto) {
    try{
      console.log(user)
      const hashedPassword = await bcrypt.hash(user.password, 10);
    const { email } = user;
    console.log(email)
    console.log(hashedPassword)
    const dbUser = await this.userRepository.findUserByEmail(email);
    if (dbUser) {
      throw new BadRequestException('Email already in use');
    }
    if (!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }
    console.log(hashedPassword)
/*     let newUser = new UserDto()

     user.password = hashedPassword;
    console.log(user)
    this.userService.createUser(user);
 */
    const newUser = await this.userRepository.createUser({
        ...user,
        password: hashedPassword,
      });

    const { password, ...userNoPassword } = user;
    return { success: 'User created succesfully', userNoPassword }; 
    }catch(error){
       throw new BadRequestException('User could not be created');
    }
  }

  async signIn(loginUserDto: LoginUserDto){
    const { email, password } = loginUserDto;
    let dbUser = await this.userRepository.findUserByEmail(email);
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

  /* async checkUserExistsByEmail(loginUserDto: LoginUserDto): Promise<boolean> {
    // Verifica si existe un usuario con el correo electrónico proporcionado
    const user = await this.userRepository.find({
      where: { email: loginUserDto.email },
    });
    return !!user;
  } */

  /* async checkPasswordMatches(loginUserDto: LoginUserDto): Promise<boolean> {
    // Verifica si la contraseña coincide con la registrada para el usuario con el correo electrónico proporcionado
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    return user && user.password === loginUserDto.password;
  } */
}
