import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  
} from 'typeorm';
import { Question } from './Question.entity';
import { User } from './User.entity';
import { Exclude } from '@nestjs/class-transformer'
import { UserPractice } from './UserPractice.entity';


@Entity()
export class Practice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @OneToMany((_type) => Question, (question) => question.practice, {
    onDelete: 'CASCADE',
    eager: true,
  })
  questions: Question[];

  @ManyToOne(() => User, (user) => user.practices, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @OneToMany(() => UserPractice, (userPractice) => userPractice.practice)
  userPractices: UserPractice[]
  // @ManyToMany(() => User, (user) => user.userPractices)
  // users: User[]


}
