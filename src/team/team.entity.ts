import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Task } from 'src/task/task.entity';
import { Sprint } from 'src/sprint/sprint.entity';

@Entity({ name: 'teams' })
export class Team {
  /**
   * Must be a generated automatically in UUID format. It cannot be null and acts as the primary key of the entity.
   * @example "UUIDdeEjemplo"
   */
  @PrimaryGeneratedColumn('uuid')
  team_id: string;

  /**
   * The team name must be a string of maximum 50 characters and cannot be null.
   * @example "Team Example"
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  team_name: string;

  /**
   * The description must be a text string and can be null.
   * @example "This is an example team."
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * The created date must be a string of maximum 50 characters and cannot be null.
   * @example "2022-01-01 12:00:00"
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  created_date: string;

  /**
   * The finish date must be a string of maximum 50 characters and can be null.
   * @example "2022-01-01 12:00:00"
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  finish_date: string;

  /**
   * The invitation code must be a string of maximum 50 characters, unique, and cannot be null.
   * @example "EXAMPLECODE"
   */
  @Column({ unique: false, type: 'varchar', length: 50, nullable: true })
  invitation_code: string;

  /**
   * One-to-many relationship with the User entity.
   * Each team has a team leader.
   */
  @ManyToOne(() => User, (user) => user.teams)
  team_leader: User;

  /**
   * Many-to-many relationship with the User entity.
   * Each team can have multiple team members.
   */
  @ManyToMany(() => User, (user) => user.teams)
  team_users: User[];

  /**
   * One-to-many relationship with the Sprint entity.
   * Each team can have multiple Sprints.
   */
  @OneToMany(() => Sprint, (sprint) => sprint.team, { cascade: true })
  sprints: Sprint[] = null;

  /**
   * One-to-many relationship with the Sprint entity.
   * Each team can have multiple Sprints.
   */
  @OneToMany(() => Task, (task) => task.team, { cascade: true })
  tasks: Task[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
