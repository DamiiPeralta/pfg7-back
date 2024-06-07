// src/entities/credentials.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Credentials {
  @PrimaryGeneratedColumn('uuid')
  id: number;
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

  @OneToOne(() => User, user => user.credentials)
  user: User;
}
