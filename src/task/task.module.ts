import { MiddlewareConsumer, Module, NestModule }   from   "@nestjs/common"
import { LoggerMiddleware } from "src/midldleware/logger.middelware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskController } from "./task.controller";
import { Task } from "./task.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Task])],
    providers: [],
    controllers: [TaskController]
})
export class TaskModule{}