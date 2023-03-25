import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User.entity';
import { AuthService } from './auth.service';
import { UserCredentialSignInDto } from './dto/auth-credential.signin.dto';
import { UserCredentialSignUpDto } from './dto/auth-credentials.signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: UserCredentialSignUpDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: UserCredentialSignInDto): Promise<{
    accessToken: string;
    user: { email: string; firstName: string; lastName: string };
  }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
