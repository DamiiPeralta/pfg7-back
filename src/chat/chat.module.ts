import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessageService } from '../message/message.service';
import { Message } from '../message/message.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [ChatGateway, ChatService, MessageService],
  exports: [ChatService],
})
export class ChatModule {}
