import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Team } from 'src/team/team.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  task_id: string;

  @Column({ length: 50 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  priority: number;

  @ManyToOne(() => User, user => user.tasks)
  user_owner: User;

  @Column()
  created: string;

  @Column()
  deadline: string;

  @ManyToMany(() => User)
  collaborators: User[];

  @Column()
  status: string;

  @ManyToOne(() => Team, team => team.tasks)
  team: Team;

  @Column()
  story_points: number;
}
