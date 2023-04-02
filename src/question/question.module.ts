import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Question } from 'src/typeorm/entities/Question.entity';
import { ColumnRowOptionRepository } from 'src/typeorm/repositories/Column-Row.option.repository';
import { FrontOptionRepository } from 'src/typeorm/repositories/Front.option.repository';
import { PracticeRepository } from 'src/typeorm/repositories/Practice.repository';
import { QuestionRepository } from 'src/typeorm/repositories/Question.repository';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), AuthModule, ConfigModule],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    QuestionRepository,
    ColumnRowOptionRepository,
    FrontOptionRepository,
    PracticeRepository,
    ConfigService,
  ],
})
export class QuestionModule {}
