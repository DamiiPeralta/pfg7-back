import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChatService {
  private users: Record<string, Partial<User>> = {};
  //agrega a los que se conectan
  onUserConnected(user: User) {
    this.users[user.user_id] = user;
  }
  //saca a los que se desconectan
  onUserDisconnected(id: string) {
    delete this.users[id];
  }
  //trae a todos los users
  getUsers() {
    return Object.values(this.users);
  }
}
