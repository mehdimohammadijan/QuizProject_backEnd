import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { Question } from 'src/typeorm/entities/Question.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get()
  getQuations(): Promise<Question[]> {
    return this.questionService.getQuestions();
  }

  @Get('/list')
  getQuationsAndOptions(): Promise<Question[]> {
    return this.questionService.getQuationsAndOptions();
  }

  @Get('/:id/:type')
  getQuestionAndOptionsById(
    @Param('id') id: string,
    @Param('type') type: string,
  ): Promise<Question> {
    return this.questionService.getQuestionAndOptionsById(id, type);
  }

  @Post('/update')
  updateQuestions(
    @Body() updateQuestionDto: UpdateQuestionDto[],
    @GetUser() user: User,
  ): Promise<string> {
    return this.questionService.updateQuestions(updateQuestionDto, user);
  }

  @Post()
  createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
  ): Promise<boolean> {
    console.log(createQuestionDto);
    return this.questionService.createQuestion(createQuestionDto, user);
  }
}
