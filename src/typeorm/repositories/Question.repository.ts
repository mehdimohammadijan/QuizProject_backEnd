import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { DataSource, Repository } from 'typeorm';
import { Practice } from '../entities/Practice.entity';
import { Question } from '../entities/Question.entity';
import { User } from '../entities/User.entity';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  constructor(private dataSource: DataSource) {
    super(Question, dataSource.createEntityManager());
  }
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    practice: Practice
  ): Promise<Question> {
    const question = this.create({
      questionText: createQuestionDto.questionText,
      questionType: createQuestionDto.type,
      practice,
    });
    try {
      await this.save(question);
      return question;
    } catch (error) {
      throw new InternalServerErrorException('question is not saved!');
    }
  }
}
