import { MiddlewareConsumer, Module, NestModule }   from   "@nestjs/common"
import { LoggerMiddleware } from "src/midldleware/logger.middelware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamController } from "./team.controller";
import { Team } from "./team.entity";
import { TeamService } from "./team.service";
import { TeamRepository } from "./team.repository";
import { UserService } from "src/user/user.service";
import { UserRepository } from "src/user/user.repository";
import { User } from "src/user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Team]),
        TypeOrmModule.forFeature([User])
            ],
    providers: [TeamService,TeamRepository,UserService,UserRepository],
    controllers: [TeamController]
})
export class TeamModule{}