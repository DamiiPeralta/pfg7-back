import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto, UserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: UserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const dbUser = await this.userService.getUserByEmail(user.email);
    if (dbUser) {
      throw new BadRequestException('Email already in use');
    }
    if (!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }
    const newUser = {
      ...user,
      password: hashedPassword,
    };
    this.userService.createUser(newUser);
    
    //Verifica que se haya creado el usuario en la bdd.

    //const foundUser = await this
    return { success: 'User created succesfully' };
  }

  async checkUserExistsByEmail(loginUserDto: LoginUserDto): Promise<boolean> {
    // Verifica si existe un usuario con el correo electrónico proporcionado
    const user = await this.userRepository.find({
      where: { email: loginUserDto.email },
    });
    return !!user;
  }

  async checkPasswordMatches(loginUserDto: LoginUserDto): Promise<boolean> {
    // Verifica si la contraseña coincide con la registrada para el usuario con el correo electrónico proporcionado
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    return user && user.password === loginUserDto.password;
  }
}
