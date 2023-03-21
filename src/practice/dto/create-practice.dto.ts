import { IsNotEmpty } from 'class-validator';

export class CreatePracticeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

}
