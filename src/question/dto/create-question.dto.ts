import { IsNotEmpty } from 'class-validator';
import { OptionRowType } from 'src/types/Question';

export class CreateQuestionDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  quiz: string;

  @IsNotEmpty()
  questionText: string;

  @IsNotEmpty()
  options: string[] | OptionRowType;

}
