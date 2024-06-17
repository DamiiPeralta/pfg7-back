import {
  Controller,
  Post,
  Get,
  Put,
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
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
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

  @Get(':userId')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get messages',
    description:
      "Waits for the user's UUID to get their messages.",
  })
  async getMessages(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.messageService.getMessages(userId);
  }

  @Put('read/:messageId')
  //@Roles(Role.User, Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Mark as read',
    description:
      'Mark a message as read',
  })
  async markAsRead(@Param('messageId', ParseUUIDPipe) messageId: string) {
    return this.messageService.markAsRead(messageId);
  }
}
