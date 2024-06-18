import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Credentials } from 'src/credentials/credentials.entity';
import { Message } from 'src/message/message.entity';
import { Team } from 'src/team/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credentials, Message, Team])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
