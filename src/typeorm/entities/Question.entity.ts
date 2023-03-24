import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Practice } from './Practice.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionText: string;

  @Column()
  questionType: string;

  @ManyToOne(() => Practice, (practice) => practice.questions, { eager: false })
  practice: Practice;
}
