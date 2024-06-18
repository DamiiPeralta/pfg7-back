import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [MessageService, WebsocketGateway],
  controllers: [MessageController],
  exports: [MessageService]
})
export class MessageModule {}
