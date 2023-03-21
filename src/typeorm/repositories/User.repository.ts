import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserCredentialSignUpDto } from 'src/auth/dto/auth-credentials.signup.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(authCredentials: UserCredentialSignUpDto): Promise<void> {
    const { firstName, lastName, email, password } = authCredentials;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('The email is already exist.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
