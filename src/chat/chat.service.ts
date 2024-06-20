import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChatService {
  private users: Record<string, Partial<User>> = {};

  onUserConnected(user: User) {
    this.users[user.user_id] = user;
  }

  onUserDisconnected(id: string) {
    delete this.users[id];
  }

  getUsers() {
    return Object.values(this.users);
  }
}
