import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Task } from 'src/task/task.entity';
import { Team } from 'src/team/team.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  token: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  nickname: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column()
  password: string;

  @Column()
  created: string;

  @Column()
  last_login: string;

  @Column({ default: false })
  status: boolean;

  @OneToMany(() => Task, task => task.user_owner)
  tasks: Task[];

  @ManyToMany(() => Team, team => team.team_users)
  @JoinTable()
  teams: Team[];
}
