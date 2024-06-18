import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { MessageModule } from '../message/message.module'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [MessageModule], // Importa MessageModule donde está definido MessageService
  providers: [WebsocketGateway],
})
export class WebsocketsModule {}
