import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { CreateUserDto } from "src/users/user.dto";
import { LoginUserDto } from "./loginUserDto.dto";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/users.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Role } from "./roles.enum";

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async createUser(user:CreateUserDto, createdAt:string){
        const hashedPassword = await bcrypt.hash(user.password, 10)
        const dbUser = await this.usersService.getUserByEmail(user.email)
        if(dbUser){
            throw new BadRequestException("Email already exist");
        }
        if(!hashedPassword){
            throw new BadRequestException("password could not be hashed")
        }
        const newUser = {
            ...user,
            password: hashedPassword
        };
        this.usersService.createUser(newUser, createdAt)
        
        return {success: "User created succesfully"};
    }

    async signIn(loginUserDto: LoginUserDto) {

        // Extraemos las credenciales del objeto UserDto
        const { email, password } = loginUserDto;
        const dbUser = await this.usersService.getUserByEmail(email)
        if(!dbUser){
            throw new BadRequestException("User not found")
        }
        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if(!isPasswordValid){
            throw new BadRequestException("Invalid Password")
        }
        const userPayload = {
            sub: dbUser.id,
            id: dbUser.id,
            email: dbUser.email,
            //isAdmin: dbUser.isAdmin
            roles:[dbUser.isAdmin ? Role.Admin : Role.User]
        };

        const token = this.jwtService.sign(userPayload)

        // Si las credenciales son válidas, retornamos un token de autenticación (simulado)
        return {success:"User logged in successfully", token};
    }
}
