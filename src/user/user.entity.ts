import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { Task } from 'src/task/task.entity';
import { Team } from 'src/team/team.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  /**
 * Must be a generated automatically in UUID format. It cannot be null and acts as the primary key of the entity.
 * @example "UUIDexample"
 */
@ApiProperty()
@PrimaryGeneratedColumn('uuid')
user_id: string;

@Column({ nullable: true })
token: string;

/**
 * The user's name must be a string of maximum 50 characters and cannot be null.
 * @example "Jhon Doe"
 */
@Column({ type: 'varchar', length: 50, nullable: false })
name: string;

/**
 * Must be a string of maximum 20 characters and cannot be null.
 * @example "JhonDoe32"
 */

@Column({ unique: true, type: 'varchar', length: 20, nullable: false })
nickname: string;

/**
 * Must be a string of maximum 50 characters, unique, have a valid structure according to the standard email addresses, and cannot be null.
 * @example useremail@example.com
 */
@Column({ type: 'varchar', length: 50, unique: true, nullable: false })
email: string;

/**
 * Must be a hashed string of maximum 80 characters and cannot be null.
 * @example "$2y$10$PECeWgKwIoRUixQOk5AADOQIgqqGaQuQZ1LiZ1OP1UbrmcXU3B93S"
 */
@Column({ type: 'varchar', length: 80, nullable: false })
password: string;

/**
 * Must be a string of maximum 30 characters and cannot be null.
 * @example "2022-01-01 12:00:00"
 */
@Column({ type: 'varchar', length: 30, nullable: false })
created: string;

/**
 * Must be a string of maximum 30 characters and can be null.
 * @example "2022-01-01 12:00:00"
 */
@Column({ type: 'varchar', length: 30, nullable: true })
last_login: string;

/**
 * Must be a boolean value. The default value is false.
 * @example true
 */
@Column({ default: false })
status: boolean;

/**
 * One-to-many relationship with the Task entity.
 * Each user can have multiple tasks.
 */
@OneToMany(() => Task, (task) => task.user_owner)
tasks: Task[];

/**
 * Many-to-many relationship with the Team entity.
 * Each user can be a member of multiple teams.
 */
@ManyToMany(() => Team, (team) => team.team_users, { cascade: true }) 
@JoinTable()
teams: Team[];

@DeleteDateColumn()
deletedAt?: Date;
}
