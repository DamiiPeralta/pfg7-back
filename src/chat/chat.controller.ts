import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from 'src/message/message.entity';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':userId')
  async getMessages(@Param('userId') userId: string): Promise<Message[]> {
    return this.chatService.getMessagesForUser(userId);
  }
}
