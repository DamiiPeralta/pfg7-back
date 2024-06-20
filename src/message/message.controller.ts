import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(
    @Body('senderId', ParseUUIDPipe) senderId: string,
    @Body('receiverId', ParseUUIDPipe) receiverId: string,
    @Body('content') content: string,
  ): Promise<Message> {
    return this.messageService.sendMessage(senderId, receiverId, content);
  }

  @Get(':senderId/:receiverId')
  async getMessages(
    @Param('senderId', ParseUUIDPipe) senderId: string,
    @Param('receiverId', ParseUUIDPipe) receiverId: string,
  ): Promise<Message[]> {
    return this.messageService.getMessages(senderId, receiverId);
  }
}
