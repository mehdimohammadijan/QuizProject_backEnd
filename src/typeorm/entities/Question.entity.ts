import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnRowOption } from './Column-Row.option.entity';
import { FrontOption } from './Front.option.entity';
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

  @OneToMany(
    (_type) => ColumnRowOption,
    (columnRowOption) => columnRowOption.question,
    { onDelete: 'CASCADE', eager: true },
  )
  columnRowOptions: ColumnRowOption[];

  @OneToMany((_type) => FrontOption, (frontOption) => frontOption.question, {
    onDelete: 'CASCADE',
    eager: true,
  })
  frontOptions: FrontOption[];
}
