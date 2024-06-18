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
    const sender = await this.usersRepository.findOne({ where: { user_id: senderId } });
    const receiver = await this.usersRepository.findOne({ where: { user_id: receiverId } });

    const message = this.messagesRepository.create({ sender, receiver, content });
    return this.messagesRepository.save(message);
  }

  async getMessages(userId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [{ sender: { user_id: userId } }, { receiver: { user_id: userId } }],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.messagesRepository.update(messageId, { read: true });
  }
}
