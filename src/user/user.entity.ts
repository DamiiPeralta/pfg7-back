import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Task } from 'src/task/task.entity';
import { Team } from 'src/team/team.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ nullable: true })
  token: string;

  @Column({ unique: true, type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 20, nullable: false })
  nickname: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  created: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  last_login: string;

  @Column({ default: false })
  status: boolean;

  @OneToMany(() => Task, (task) => task.user_owner)
  tasks: Task[];

  @ManyToMany(() => Team, (team) => team.team_users)
  @JoinTable()
  teams: Team[];
}
