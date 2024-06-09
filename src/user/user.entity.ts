import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from 'src/task/task.entity';
import { Team } from 'src/team/team.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Credentials } from 'src/credentials/credentials.entity';

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

@Column({ default: null })
profilePicture: string;

@Column({default: false})
is_admin: boolean;

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

@OneToOne(() => Credentials, credentials => credentials.user, { cascade: true })
@JoinColumn()
credentials: Credentials;
}
