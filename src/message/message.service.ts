import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const sender = await this.usersRepository.findOneOrFail({ where: { user_id: senderId } });
    const receiver = await this.usersRepository.findOneOrFail({ where: { user_id: receiverId } });

    const message = this.messagesRepository.create({
      sender,
      receiver,
      content,
    });

    return this.messagesRepository.save(message);
  }

  async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        { sender: { user_id: senderId }, receiver: { user_id: receiverId } },
        { sender: { user_id: receiverId }, receiver: { user_id: senderId } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }
}
