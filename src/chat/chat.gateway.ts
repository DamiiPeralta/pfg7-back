import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private activeUsers: Map<string, string> = new Map();

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string): void {
    this.activeUsers.set(userId, client.id);
    client.join(userId); // Unir al usuario a una sala con su ID de usuario
    this.logger.log(`User joined: ${userId}, Socket ID: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { senderId: string; receiverId: string; content: string }): Promise<void> {
    const { senderId, receiverId, content } = payload;

    try {
      const message = await this.chatService.sendMessage(senderId, receiverId, content);

      // Emitir el mensaje al receptor específico
      this.server.to(receiverId).emit('message', message);

      // También emitir el mensaje al remitente si lo deseas (opcional)
      this.server.to(senderId).emit('message', message);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
    }
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleDisconnect(client: Socket) {
    const userId = this.findUserIdBySocketId(client.id);
    if (userId) {
      this.activeUsers.delete(userId);
      this.logger.log(`Client disconnected: ${client.id} (User ID: ${userId})`);
    } else {
      this.logger.log(`Client disconnected: ${client.id} (Unknown User)`);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  private findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, id] of this.activeUsers) {
      if (id === socketId) {
        return userId;
      }
    }
    return undefined;
  }
}
