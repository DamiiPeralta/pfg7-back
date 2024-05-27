import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Team } from 'src/team/team.entity';

@Entity({ name: 'tasks' })
export class Task {
  /**
   * Must be generated automatically in UUID format. It cannot be null and acts as the primary key of the entity.
   * @example "UUIDdeEjemplo"
   */
  @PrimaryGeneratedColumn('uuid')
  task_id: string;

  /**
   * The name must be a string of maximum 50 characters and cannot be null.
   * @example "Example Task"
   */
  @Column({ length: 50, type: "varchar", nullable: false })
  name: string;

  /**
   * The description must be a text string and can be null.
   * @example "This is an example task."
   */
  @Column({ type: "text", nullable: true })
  description: string;

  /**
   * The created date must be a string and cannot be null.
   * @example "2022-01-01 12:00:00"
   */
  @Column({ type: "varchar", nullable: false })
  created: string;

  /**
   * The deadline must be a string and can be null.
   * @example "2022-01-01 12:00:00"
   */
  @Column({ type: "varchar", nullable: true })
  deadline: string;

  /**
   * The status must be a string and can be null.
   * @example "In Progress"
   */
  @Column({ type: "varchar", nullable: true })
  status: string;

  /**
   * The priority must be an integer and can be null.
   * @example 1
   */
  @Column({ type: "int", nullable: true })
  priority: number;

  /**
   * The story points must be an integer and can be null.
   * @example 2
   */
  @Column({ type: "int", nullable: true })
  story_points: number;

  /**
   * Many-to-many relationship with the User entity.
   * Each task can have multiple collaborators.
   */
  @ManyToMany(() => User)
  collaborators: User[];

  /**
   * One-to-many relationship with the User entity.
   * Each task has an owner.
   */
  @ManyToOne(() => User, user => user.tasks)
  user_owner: User;

  /**
   * One-to-many relationship with the Team entity.
   * Each task belongs to a team.
   */
  @ManyToOne(() => Team, team => team.tasks)
  team: Team;
}