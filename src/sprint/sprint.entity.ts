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
  
    @Column({ type: 'varchar', nullable: false })
    fecha_inicio: string;
  
    @Column({ type: 'varchar', nullable: false })
    fecha_fin: string;
  
    @Column({ type: 'varchar', length: 20, nullable: false })
    estado: string;
  
    @ManyToOne(() => Team, (team) => team.sprints, { nullable: false })
    team: Team;
  
    @OneToMany(() => Task, (task) => task.sprint)
    tasks: Task[];
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  