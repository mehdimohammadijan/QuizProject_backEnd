import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from 'src/typeorm/entities/Question.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { ColumnRowOptionRepository } from 'src/typeorm/repositories/Column-Row.option.repository';
import { FrontOptionRepository } from 'src/typeorm/repositories/Front.option.repository';
import { PracticeRepository } from 'src/typeorm/repositories/Practice.repository';
import { QuestionRepository } from 'src/typeorm/repositories/Question.repository';
import { Connection } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { isUUID } from 'class-validator';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly columnRowOptionRepository: ColumnRowOptionRepository,
    private readonly frontOptionRepository: FrontOptionRepository,
    private readonly practiceRepository: PracticeRepository,
    private readonly connection: Connection,
  ) {}

  async getQuestions(): Promise<Question[]> {
    return await this.questionRepository
      .createQueryBuilder('question')
      .getMany();
  }

  async getQuestionById(id: string): Promise<Question> {
    if (id && !isUUID(id))
      throw new NotFoundException(`Id ${id} is not in correct format`);
    try {
      const found = this.questionRepository.findOne({
        where: { id },
      });
      if (!found)
        throw new NotFoundException(`Question with id ${id} not found`);
      return found;
    } catch (error) {
      return error;
    }
  }

  async getQuationsAndOptions(): Promise<Question[]> {
    try {
      const result = await this.questionRepository
        .createQueryBuilder('question')
        .leftJoinAndSelect('question.practice', 'practice')
        .leftJoinAndSelect('question.frontOptions', 'frontOptions')
        .leftJoinAndSelect('question.columnRowOptions', 'columnRowOptions')
        .getMany();
      return result;
    } catch (error) {
      return error;
    }
  }

  async getQuestionAndOptionsById(id: string, type: string): Promise<Question> {
    if (id && !isUUID(id))
      throw new NotFoundException(`Id ${id} is not in correct format`);
    try {
      let question = null;
      if (type === 'Front') {
        const result = await this.questionRepository
          .createQueryBuilder('question')
          .leftJoinAndSelect('question.frontOptions', 'frontOptions')
          .getOne();
        question = {
          ...result,
          frontOptions: {
            leftOptions: result.frontOptions.map((option) => ({
              id: option.id,
              optionText: option.optionText,
            })),
            rightOptions: result.frontOptions.map((option) => ({
              id: option.id,
              optionAnswer: option.optionAnswer,
            })),
          },
        };
      } else {
        question = await this.questionRepository
          .createQueryBuilder('question')
          .leftJoinAndSelect('question.columnRowOptions', 'columnRowOptions')
          .where('question.id = :id', { id })
          .getOne();
      }

      if (!question)
        throw new NotFoundException(`Question with id ${id} not found`);
      return question;
    } catch (error) {
      return error;
    }
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    _user: User,
  ): Promise<boolean> {
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
    return true;
  }

  async updateQuestions(
    updateQuestionDto: UpdateQuestionDto[],
    user: User,
  ): Promise<string> {
    if (updateQuestionDto.length === 0) {
      return 'Empty data';
    }
    for (const question of updateQuestionDto) {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        if (question.opt === 'create') {
          const createQuestionDto = new CreateQuestionDto();
          createQuestionDto.type = question.questionType;
          createQuestionDto.questionText = question.questionText;
          createQuestionDto.quiz = question.practice.id;
          createQuestionDto.options =
            question.questionType === 'Front'
              ? {
                  leftOption: question.frontOptions.leftOptions.map(
                    (option) => option.optionText,
                  ),
                  rightOption: question.frontOptions.rightOptions.map(
                    (option) => option.optionAnswer,
                  ),
                }
              : question.columnRowOptions.map((option) => option.optionText);
          await this.createQuestion(createQuestionDto, user);
        } else if (question.opt === 'edit') {
          await this.updateQuestion(question);
        } else if (question.opt === 'delete') {
          this.deleteQuestion(question);
          if (question.questionType === 'Front') {
            this.frontOptionRepository.deleteOptions(question.id);
          } else {
            this.columnRowOptionRepository.deleteOptions(question.id);
          }
        }
        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    }
    return 'Successfully updated';
  }
  async updateQuestion(questionDto: UpdateQuestionDto): Promise<Question> {
    console.log(questionDto);
    const question = await this.getQuestionById(questionDto.id);
    const { questionText, questionType, practice } = questionDto;
    const practiceRecived = await this.practiceRepository.findOne({
      where: { id: practice.id },
    });
    question.questionText = questionText;
    question.questionType = questionType;
    question.practice = practiceRecived;
    await this.questionRepository.save(question);
    // save options based on question type
    if (question.questionType === 'Front') {
      await this.frontOptionRepository.updateOptions(questionDto, question);
    } else {
      await this.columnRowOptionRepository.updateOptions(questionDto, question);
    }
    return question;
  }

  async deleteQuestion(questionDto: UpdateQuestionDto): Promise<void> {
    const result = await this.questionRepository.delete(questionDto.id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Practice with id ${questionDto.id} is not found`,
      );
    }
  }
}
