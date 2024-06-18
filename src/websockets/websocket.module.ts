import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [MessageModule],
  providers: [WebsocketGateway],
})
export class WebsocketsModule {}
