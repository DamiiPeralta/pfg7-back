import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Task } from 'src/task/task.entity';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  team_id: string;

  @ManyToOne(() => User, user => user.teams)
  team_leader: User;

  @ManyToMany(() => User, user => user.teams)
  team_users: User[];

  @OneToMany(() => Task, task => task.team)
  tasks: Task[];

  @Column({ length: 50 })
  team_name: string;

  @Column('text')
  description: string;

  @Column()
  created_date: string;

  @Column()
  finish_date: string;

  @Column({ unique: true })
  invitation_code: string;
}
