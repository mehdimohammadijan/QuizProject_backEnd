import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { OptionRowType } from 'src/types/Question';
import { DataSource, Repository } from 'typeorm';
import { FrontOption } from '../entities/Front.option.entity';
import { Question } from '../entities/Question.entity';
import { UpdateQuestionDto } from 'src/question/dto/update-question.dto';

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
  async deleteOptions(quastionId: string): Promise<void> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(FrontOption)
      .where('questionId = :id', { id: quastionId })
      .execute();
  }
  async updateOptions(
    updateQuestionDto: UpdateQuestionDto,
    question: Question,
  ) {
    try {
      console.log(updateQuestionDto);
      //delete old options
      await this.deleteOptions(updateQuestionDto.id);
      // create new options
      for (
        let index = 0;
        index < updateQuestionDto.frontOptions.leftOptions.length;
        index++
      ) {
        await this.save(
          this.create({
            optionText:
              updateQuestionDto.frontOptions.leftOptions[index].optionText,
            optionAnswer:
              updateQuestionDto.frontOptions.rightOptions[index].optionAnswer,
            question,
          }),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('Front option is not editted!');
    }
  }
}
