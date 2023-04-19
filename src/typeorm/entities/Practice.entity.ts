import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question.entity';
import { User } from './User.entity';
import { Exclude } from '@nestjs/class-transformer'

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
}
