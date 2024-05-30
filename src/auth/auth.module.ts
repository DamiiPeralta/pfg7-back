import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { UserRepository } from "../user/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers:[AuthService, AuthRepository, UserRepository, UserService],
    controllers:[AuthController]
})
export class AuthModule{}
