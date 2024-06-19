import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { Message } from '../message/message.entity';

@Injectable()
export class ChatService {
  constructor(private readonly messageService: MessageService) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<Message> {
    return this.messageService.sendMessage(senderId, receiverId, content);
  }

  async getMessagesForUser(userId: string): Promise<Message[]> {
    return this.messageService.getMessages(userId);
  }
}
