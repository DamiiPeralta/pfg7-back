import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "../user/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { Credentials } from "src/credentials/credentials.entity";
import { EmailService } from "src/email/services/email/email.service";
import { EmailModule } from "src/email/email.module";
import { Email } from "src/email/providers/email/email";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Credentials])],
    providers:[AuthService, UserRepository, UserService, Email, EmailService],
    controllers:[AuthController]
})
export class AuthModule{}
