import { IsNotEmpty } from 'class-validator';

export class AssignedPracticeDto {
  
  id: string;

  @IsNotEmpty()
  email: string;

  quiz: string;

  @IsNotEmpty()
  quizId: string;

  @IsNotEmpty()
  opt: string

}
