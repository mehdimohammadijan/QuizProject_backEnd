import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question.entity';

@Entity()
export class ColumnRowOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  optionPosition: number;

  @Column()
  optionText: string;

  @ManyToOne(() => Question, (question) => question.columnRowOptions, {
    eager: false,
  })
  question: Question;
}
