import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [ChatGateway, ChatService, MessageService],
})
export class ChatModule {}
