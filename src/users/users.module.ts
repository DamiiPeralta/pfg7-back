import { MiddlewareConsumer, Module, NestModule }   from   "@nestjs/common"
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { LoggerMiddleware } from "src/midldleware/logger.middelware";
import { UsersRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService,UsersRepository,
        {
            provide: 'API_USERS',//Api de usuarios que trae un array de usuarios del endpoint proporcionado
            useFactory: async() => {
                const apiUsers = await fetch(
                    'https://jsonplaceholder.typicode.com/users',
                ).then((response)=> response.json());
                return apiUsers.map(user => {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                }) 
            }
        }
    ],
    controllers: [UsersController]
})
export class UsersModule{}