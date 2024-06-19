import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  @ApiOperation({
    summary: 'Sends messages',
    description:
      "Waits for the user's UUID to send messages, the user's UUID to receive messages, and the message.",
  })
  async sendMessage(
    @Body('senderId', ParseUUIDPipe) senderId: string,
    @Body('receiverId', ParseUUIDPipe) receiverId: string,
    @Body('content') content: string,
  ) {
    return this.messageService.sendMessage(senderId, receiverId, content);
  }

  @Get(':senderId/:receiverId')
  @ApiOperation({
    summary: 'Get messages between two users',
    description: 'Waits for the sender UUID and receiver UUID to get their messages.',
  })
  async getMessages(
    @Param('senderId', ParseUUIDPipe) senderId: string,
    @Param('receiverId', ParseUUIDPipe) receiverId: string,
  ) {
    return this.messageService.getMessages(senderId, receiverId);
  }
}
