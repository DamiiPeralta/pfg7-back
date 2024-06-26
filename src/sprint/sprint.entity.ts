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
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { statusSprint } from 'src/enum/sprint.enum';

@Entity({ name: 'sprints' })
export class Sprint {
  /**
   * Must be a generated automatically in UUID format. It cannot be null and acts as the primary key of the entity.
   * @example "UUIDexample"
   */
  @PrimaryGeneratedColumn('uuid')
  sprint_id: string;

  /**
   The name must be a non-empty string of maximum 50 characters.
   @example "Example sprint"
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   The goal must be an optional string of maximum 20 characters.
   @example "Improve the quality of our code"
   */
   @Column({ type: 'text', nullable: true, default: '' })
   @IsOptional()
   @IsString()
   @MaxLength(20)
   goal: string;

  /**
   * Must be a valid date, in the format YYYY-MM-DD. It cannot be null.
   */
  @Column({ type: 'varchar', nullable: false })
  created: string;

  /**
   * Must be a string, in the format YYYY-MM-DD.
   */
  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  deadline: string;

  /**
   The status must be an optional string.
   @example "In progress"
   */
  @Column({ type: "enum", enum: statusSprint, nullable: true })
  @IsOptional()
  status: statusSprint;

  @ManyToOne(() => Team, (team) => team.sprints, { nullable: true })
  team: Team;

  @OneToMany(() => Task, (task) => task.sprint)
  tasks: Task[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
