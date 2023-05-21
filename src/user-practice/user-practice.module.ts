import { Module } from '@nestjs/common';
import { UserPracticeService } from './user-practice.service';
import { UserPracticeController } from './user-practice.controller';
import { UserPracticeRepository } from 'src/typeorm/repositories/User-Practice.repository';
import { UserPractice } from 'src/typeorm/entities/UserPractice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PracticeModule } from 'src/practice/practice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPractice]),
    AuthModule,
    ConfigModule,
    AuthModule,
    PracticeModule
  ],
  providers: [UserPracticeService, UserPracticeRepository],
  controllers: [UserPracticeController],
})
export class UserPracticeModule {}
