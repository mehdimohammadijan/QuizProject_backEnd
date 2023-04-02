import { Injectable } from '@nestjs/common';
import { Question } from 'src/typeorm/entities/Question.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { ColumnRowOptionRepository } from 'src/typeorm/repositories/Column-Row.option.repository';
import { FrontOptionRepository } from 'src/typeorm/repositories/Front.option.repository';
import { PracticeRepository } from 'src/typeorm/repositories/Practice.repository';
import { QuestionRepository } from 'src/typeorm/repositories/Question.repository';
import { Connection } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly columnRowOptionRepository: ColumnRowOptionRepository,
    private readonly frontOptionRepository: FrontOptionRepository,
    private readonly practiceRepository: PracticeRepository,
    private readonly connection: Connection,
  ) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    _user: User,
  ): Promise<Question> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const practice = await this.practiceRepository.findOne({
      where: { id: createQuestionDto.quiz },
    });

    try {
      const question = await this.questionRepository.createQuestion(
        createQuestionDto,
        practice,
      );
      if (createQuestionDto.type === 'Front') {
        await this.frontOptionRepository.createOptions(
          createQuestionDto,
          question,
        );
      } else {
        await this.columnRowOptionRepository.createOptions(
          createQuestionDto,
          question,
        );
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    return new Question()
    // return this.questionRepository.createQuestion(createQuestionDto);
  }
}
