import { Controller, Post, Get, Put, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(
    @Body('senderId', ParseUUIDPipe) senderId: string,
    @Body('receiverId', ParseUUIDPipe) receiverId: string,
    @Body('content') content: string,
  ) {
    return this.messageService.sendMessage(senderId, receiverId, content);
  }

  @Get(':userId')
  async getMessages(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.messageService.getMessages(userId);
  }

  @Put('read/:messageId')
  async markAsRead(@Param('messageId', ParseUUIDPipe) messageId: string) {
    return this.messageService.markAsRead(messageId);
  }
}
