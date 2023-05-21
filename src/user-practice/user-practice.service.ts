import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserPractice } from 'src/typeorm/entities/UserPractice.entity';
import { PracticeRepository } from 'src/typeorm/repositories/Practice.repository';
import { UserPracticeRepository } from 'src/typeorm/repositories/User-Practice.repository';
import { UserRepository } from 'src/typeorm/repositories/User.repository';

@Injectable()
export class UserPracticeService {
  constructor(
    private readonly practiceRepository: PracticeRepository,
    private readonly userRepository: UserRepository,
    private readonly userPracticeRepository: UserPracticeRepository,
  ) {}

  async getUserPractices() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userPractices', 'userPractice')
      .innerJoinAndSelect('userPractice.practice', 'practice')
      .getMany();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      practices: user.userPractices,
    }));
  }

  async handlePracticeToUsers(
    data: {
      id: string;
      email: string;
      quiz: string;
      quizId: string;
      opt: string;
    }[],
  ): Promise<string> {
    try {
      for (const { id, email, quiz, quizId, opt } of data) {
        const user = await this.userRepository.findOneBy({ email });
        const quizEntity = await this.practiceRepository.findOneBy({
          id: quizId,
        });
        if (opt === 'new') {
          const userPractice = new UserPractice();
          userPractice.user = user;
          userPractice.practice = quizEntity;

          await this.userPracticeRepository.save(userPractice);
        } else if (opt === 'delete') {
          await this.userPracticeRepository.delete({
            practice: { id: quizId },
            user: { id },
          });
        }
      }
      return 'success';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Operation failed', error);
    }
  }
}
