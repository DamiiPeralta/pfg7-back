import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Task } from 'src/task/task.entity';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  team_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  team_name: string;
  
  @Column({ type: 'text', nullable: true })
  description: string;
  
  @Column({ type: 'varchar', length: 50, nullable: false })
  created_date: string;
  
  @Column({ type: 'varchar', length: 50, nullable: true })
  finish_date: string;
  
  @Column({ unique: true, type: 'varchar', length: 50 })
  invitation_code: string;

  @ManyToOne(() => User, user => user.teams)
  team_leader: User;

  @ManyToMany(() => User, user => user.teams)
  team_users: User[];

  @OneToMany(() => Task, task => task.team)
  tasks: Task[];
}
