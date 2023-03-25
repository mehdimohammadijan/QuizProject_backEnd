import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/typeorm/repositories/User.repository';
import { UserCredentialSignUpDto } from './dto/auth-credentials.signup.dto';
import { UserCredentialSignInDto } from './dto/auth-credential.signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/typeorm/entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: UserCredentialSignUpDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: UserCredentialSignInDto): Promise<{
    accessToken: string;
    user: { email: string; firstName: string; lastName: string };
  }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return {
        accessToken,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } else {
      throw new UnauthorizedException('Please check your credentials');
    }
  }
}
