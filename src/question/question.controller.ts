import { Body, Controller, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { Question } from 'src/typeorm/entities/Question.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}
  @Post()
  createPractice(
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
  ): Promise<Question> {
    console.log(createQuestionDto)
    return this.questionService.createQuestion(createQuestionDto, user);
  }
}
