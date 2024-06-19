import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from 'src/message/message.entity';

@Controller('messages')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get(':senderId/:receiverId')
    async getMessages(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
    ): Promise<Message[]> {
        return this.chatService.getMessagesBetweenUsers(senderId, receiverId);
    }
}
