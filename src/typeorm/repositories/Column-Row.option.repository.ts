import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { DataSource, Repository } from 'typeorm';
import { ColumnRowOption } from '../entities/Column-Row.option.entity';
import { Question } from '../entities/Question.entity';
import { UpdateQuestionDto } from 'src/question/dto/update-question.dto';

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

  async deleteOptions(quastionId: string): Promise<void> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ColumnRowOption)
      .where('questionId = :id', { id: quastionId })
      .execute();

  }
  async updateOptions(
    updateQuestionDto: UpdateQuestionDto,
    question: Question,
  ) {
    try {
      //delete old options
      this.deleteOptions(updateQuestionDto.id);
      // create new options
      for (
        let index = 0;
        index < updateQuestionDto.columnRowOptions.length;
        index++
      ) {
        await this.save(
          this.create({
            optionText: updateQuestionDto.columnRowOptions[index].optionText,
            optionPosition: index,
            question,
          }),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('Front option is not saved!');
    }
  }
}
