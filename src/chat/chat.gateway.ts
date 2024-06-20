import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { User } from 'src/user/user.entity';
import { Message } from 'src/message/message.entity';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {

  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const { name, user_id, token } = socket.handshake.auth;
      if (!name || !user_id || !token) {
        socket.disconnect();
        return;
      }

      this.chatService.onUserConnected({ user_id, name, token } as User);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        socket.emit('welcome-message', `Bienvenido a la sala ${roomId}`);
      });

      socket.on('disconnect', () => {
        this.chatService.onUserDisconnected(socket.id);
      });
    });
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: Message,
    @ConnectedSocket() socket: Socket,
  ) {
    const { name, token } = socket.handshake.auth;
    if (!message.content || !name || !token) {
      return;
    }
    
    // Enviar el mensaje solo al socket del receptor específico
    this.server.to(socket.id).emit('on-message', message);
  }
}
