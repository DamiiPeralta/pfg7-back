import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    {
      senderId,
      receiverId,
      content,
    }: { senderId: string; receiverId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messageService.sendMessage(
      senderId,
      receiverId,
      content,
    );

    // Emitir el mensaje solo a la sala del receptor (receiverId)
    client.to(receiverId).emit('message', message);

    console.log('Message sent:', message);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    // Unir al cliente a la sala correspondiente al userId
    client.join(userId.toString());
    console.log(`Client ${client.id} joined room ${userId}`);
  }
  
}
