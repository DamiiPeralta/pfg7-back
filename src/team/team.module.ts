import { MiddlewareConsumer, Module, NestModule }   from   "@nestjs/common"
import { LoggerMiddleware } from "src/midldleware/logger.middelware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamController } from "./team.controller";
import { Team } from "./team.entity";
import { TeamService } from "./team.service";
import { TeamRepository } from "./team.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Team])],
    providers: [TeamService,TeamRepository],
    controllers: [TeamController]
})
export class TeamModule{}