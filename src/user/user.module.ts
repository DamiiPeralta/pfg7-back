import { MiddlewareConsumer, Module, NestModule }   from   "@nestjs/common"
import { LoggerMiddleware } from "src/midldleware/logger.middelware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserRepository],
    controllers: [UserController]
})
export class UserModule{}