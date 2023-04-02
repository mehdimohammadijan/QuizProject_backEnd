import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question.entity';

@Entity()
export class FrontOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  optionText: string;

  @Column()
  optionAnswer: string;

  @ManyToOne(() => Question, (question) => question.frontOptions, {
    eager: false,
  })
  question: Question;
}
