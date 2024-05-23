import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { UsersRepository } from "src/users/users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";

@Module({
    imports: [TypeOrmModule.forFeature([User]),],
    providers:[AuthService, AuthRepository, UsersRepository, UsersService],
    controllers:[AuthController]
})
export class AuthModule{}