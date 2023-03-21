import { IsEmail, IsString } from 'class-validator';

export class UserCredentialSignInDto {
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  // @MaxLength(32)
  password: string;
}
