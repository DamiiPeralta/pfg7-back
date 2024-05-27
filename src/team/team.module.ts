import { MiddlewareConsumer, Module, NestModule }   from   "@nestjs/common"
import { LoggerMiddleware } from "src/midldleware/logger.middelware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamController } from "./team.controller";
import { Team } from "./team.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Team])],
    providers: [],
    controllers: [TeamController]
})
export class TeamModule{}