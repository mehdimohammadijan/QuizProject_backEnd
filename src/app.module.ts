import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './typeorm/entities/User.entity';
import { Practice } from './typeorm/entities/Practice.entity';
import { PracticeModule } from './practice/practice.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { Question } from './typeorm/entities/Question.entity';
import { configValidtionSchema } from './config.schema';
import { ColumnRowOption } from './typeorm/entities/Column-Row.option.entity';
import { FrontOption } from './typeorm/entities/Front.option.entity';
import { UserPractice } from './typeorm/entities/UserPractice.entity';
import { UserPracticeModule } from './user-practice/user-practice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidtionSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          Question,
          User,
          Practice,
          ColumnRowOption,
          FrontOption,
          UserPractice,
        ],
      }),
    }),

    PracticeModule,
    AuthModule,
    QuestionModule,
    UserPracticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
