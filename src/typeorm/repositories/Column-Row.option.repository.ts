import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { DataSource, Repository } from 'typeorm';
import { ColumnRowOption } from '../entities/Column-Row.option.entity';
import { Question } from '../entities/Question.entity';

@Injectable()
export class ColumnRowOptionRepository extends Repository<ColumnRowOption> {
  constructor(private dataSource: DataSource) {
    super(ColumnRowOption, dataSource.createEntityManager());
  }

  async createOptions(
    createQuestionDto: CreateQuestionDto,
    question: Question,
  ) {
    try {
      for (
        let index = 0;
        index < (createQuestionDto.options as string[]).length;
        index++
      ) {
        await this.save(
          this.create({
            optionText: createQuestionDto.options[index],
            optionPosition: index,
            question,
          }),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('Column-Row option is not saved!');
    }
  }
}
