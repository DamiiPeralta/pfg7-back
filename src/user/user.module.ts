import { MiddlewareConsumer, Module, NestModule }   from   "@nestjs/common"
import { LoggerMiddleware } from "src/midldleware/logger.middelware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { Credentials } from "src/credentials/credentials.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Credentials]),    
    ],
    providers: [UserService, UserRepository],
    controllers: [UserController]
})
export class UserModule{}