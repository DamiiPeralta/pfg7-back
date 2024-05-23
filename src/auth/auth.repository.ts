import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { LoginUserDto } from "./loginUserDto.dto";

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async checkUserExistsByEmail(loginUserDto: LoginUserDto): Promise<boolean> {
        // Verifica si existe un usuario con el correo electrónico proporcionado
        const user = await this.userRepository.find({ 
            where: { email: loginUserDto.email }});;
        return !!user;
    }

    async checkPasswordMatches(loginUserDto:LoginUserDto): Promise<boolean> {
        // Verifica si la contraseña coincide con la registrada para el usuario con el correo electrónico proporcionado
        const user = await this.userRepository.findOne({ 
            where: { email: loginUserDto.email }});;
        return user && user.password === loginUserDto.password;
    }
}