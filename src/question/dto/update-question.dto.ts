import { IsNotEmpty } from 'class-validator';
import { ColumnRowOption, FrontOptions } from 'src/types/Question';
import { Practice } from 'src/types/Practice';

export class UpdateQuestionDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  opt: string;

  @IsNotEmpty()
  questionText: string;

  @IsNotEmpty()
  questionType: string;

  @IsNotEmpty()
  practice: Practice;

  columnRowOptions: ColumnRowOption[];

  frontOptions: FrontOptions;
}
