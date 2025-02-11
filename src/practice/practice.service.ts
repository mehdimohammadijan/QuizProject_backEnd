import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Practice } from 'src/typeorm/entities/Practice.entity';
import { PracticeRepository } from 'src/typeorm/repositories/Practice.repository';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { isUUID } from 'class-validator';
import { FullDetailPractice } from './dto/saveList-practice.dto';
import { User } from 'src/typeorm/entities/User.entity';
import { UserRepository } from 'src/typeorm/repositories/User.repository';

@Injectable()
export class PracticeService {
  constructor(
    private readonly practiceRepository: PracticeRepository,
    private readonly userRepository: UserRepository,
  ) {}

  createPractice(
    createPracticeDto: CreatePracticeDto,
    user: User,
  ): Promise<Practice> {
    return this.practiceRepository.createPractice(createPracticeDto, user);
  }

  getPractices(): Promise<Practice[]> {
    return this.practiceRepository.getPractices();
  }

  async getPracticeById(id: string): Promise<Practice> {
    if (id && !isUUID(id))
      throw new NotFoundException(`Id ${id} is not in correct format`);
    try {
      const found = this.practiceRepository.findOne({
        where: { id },
      });
      if (!found)
        throw new NotFoundException(`Practice with id ${id} not found`);
      return found;
    } catch (error) {
      return error;
    }
  }

  async updatePractice(
    id: string,
    practiceDto: CreatePracticeDto,
  ): Promise<Practice> {
    const practice = await this.getPracticeById(id);
    const { title, description } = practiceDto;
    practice.title = title;
    practice.description = description;
    await this.practiceRepository.save(practice);

    return practice;
  }

  async deletePractice(id: string): Promise<void> {
    const result = await this.practiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Practice with id ${id} is not found`);
    }
  }
  async saveList(
    fullDetailDto: FullDetailPractice[],
    user: User,
  ): Promise<string> {
    try {
      for (let index = 0; index < fullDetailDto.length; index++) {
        const newPractice: CreatePracticeDto = {
          title: fullDetailDto[index].title,
          description: fullDetailDto[index].description,
        };
        if (fullDetailDto[index].opt === 'new') {
          await this.createPractice(newPractice, user);
        } else if (fullDetailDto[index].opt === 'edit') {
          await this.updatePractice(fullDetailDto[index].id, newPractice);
        } else if (fullDetailDto[index].opt === 'delete') {
          await this.deletePractice(fullDetailDto[index].id);
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Operation failed', error);
    }
    return 'SuccessFully Updated!';
  }
  // async assignPracticeToUsers(
  //   data: { email: string; quiz: string; quizId: string }[],
  // ): Promise<string> {
  //   try {
  //     for (const { email, quiz, quizId } of data) {
  //       const user = await this.userRepository.findOneBy({ email });
  //       console.log(user.userPractices)
  //       // const quizEntity = await this.practiceRepository.findOneBy({
  //       //   id: quizId,
  //       // });
  //       // const userPractice = new UserPractice();
  //       // userPractice.user = user;
  //       // userPractice.practice = quizEntity;

  //       // await this.userPracticeRepository.save(userPractice);
  //       return 'success';
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException('Operation failed', error);
  //   }
  // }
}
