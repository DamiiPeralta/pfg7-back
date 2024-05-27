import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Team } from 'src/team/team.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  task_id: string;

  @Column({ length: 50, type:"varchar", nullable: false })
  name: string;

  @Column({type:"text", nullable: true})
  description: string;
  
  @Column({type:"varchar", nullable: false})
  created: string;
  
  @Column({type:"varchar", nullable: true})
  deadline: string;
  
  @Column({type:"varchar", nullable: true})
  status: string;

  @Column({type:"int", nullable: true})
  priority: number;
  
  @Column({type:"int", nullable: true})
  story_points: number;
  
  @ManyToMany(() => User)
  collaborators: User[];
  
  @ManyToOne(() => User, user => user.tasks)
  user_owner: User;

  @ManyToOne(() => Team, team => team.tasks)
  team: Team;
}
