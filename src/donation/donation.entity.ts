import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinTable,
    DeleteDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
  } from 'typeorm';
import { User } from 'src/user/user.entity';
  
  @Entity({ name: 'donations' })
  export class Donation {
    /**
   * Must be a generated automatically in UUID format. It cannot be null and acts as the primary key of the entity.
   * @example "UUIDexample"
   */
  @PrimaryGeneratedColumn('uuid')
  donation_id: string;
  
  /**
   * The amount donated by the user. Canot be null.
   * @example 10.50
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;
  
  /**
   * The donation date. Must be in format "YYYY-MM-DD HH:MM:SS". Canot be null.
   * @example "2022-01-01 12:00:00"
   */
  @Column({ type: 'varchar', length: 30, nullable: false })
  date: string;
  
  @ManyToOne(() => User, (user) => user.donations)
  user: User;
  }
  