// websocket.gateway.ts
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
    origin: 'http://localhost:3001', // URL del frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Message received from client ${client.id}: ${message}`);

    client.broadcast.emit('message', message);
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
    this.server.to(receiverId.toString()).emit('message', message);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId.toString());
  }
}
