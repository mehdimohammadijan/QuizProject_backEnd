import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { OptionRowType } from 'src/types/Question';
import { DataSource, Repository } from 'typeorm';
import { FrontOption } from '../entities/Front.option.entity';
import { Question } from '../entities/Question.entity';

@Injectable()
export class FrontOptionRepository extends Repository<FrontOption> {
  constructor(private dataSource: DataSource) {
    super(FrontOption, dataSource.createEntityManager());
  }

  async createOptions(
    createQuestionDto: CreateQuestionDto,
    question: Question,
  ) {
    try {
      for (
        let index = 0;
        index < (createQuestionDto.options as OptionRowType).leftOption.length;
        index++
      ) {
        await this.save(
          this.create({
            optionText: (createQuestionDto.options as OptionRowType).leftOption[
              index
            ],
            optionAnswer: (createQuestionDto.options as OptionRowType)
              .rightOption[index],
            question,
          }),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('Front option is not saved!');
    }
  }
}
