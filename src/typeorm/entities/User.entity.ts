import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Practice } from './Practice.entity';
import { UserPractice } from './UserPractice.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @OneToMany((_type) => Practice, (practice) => practice.user, {
    eager: true,
  })
  practices: Practice[];

  @OneToMany(() => UserPractice, (userPractice) => userPractice.user)
  userPractices: UserPractice[];
  // @ManyToMany(() => Practice, (practice) => practice.users)
  // @JoinTable()
  // userPractices: Practice[];
}
