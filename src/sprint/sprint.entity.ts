import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    DeleteDateColumn,
  } from 'typeorm';
  import { Task } from 'src/task/task.entity';
  import { Team } from 'src/team/team.entity';
  
  @Entity({ name: 'sprints' })
  export class Sprint {
    @PrimaryGeneratedColumn('uuid')
    sprint_id: string;
  
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: "text", nullable: true })
    goal: string;
  
    @Column({ type: 'varchar', nullable: false })
    created: string;
  
    @Column({ type: 'varchar', nullable: true })
    deadline: string;
  
    @Column({ type: 'varchar', length: 20, nullable: true })
    status: string;
  
    @ManyToOne(() => Team, (team) => team.sprints, { nullable: true })
    team: Team;
  
    @OneToMany(() => Task, (task) => task.sprint)
    tasks: Task[];
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  