import { IsNotEmpty } from 'class-validator';

export class FullDetailPractice {
  @IsNotEmpty()
  opt: string;

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
