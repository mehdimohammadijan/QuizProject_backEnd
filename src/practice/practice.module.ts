import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { Practice } from 'src/typeorm/entities/Practice.entity';
import { PracticeRepository } from 'src/typeorm/repositories/Practice.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserPracticeModule } from 'src/user-practice/user-practice.module';

@Module({
  imports: [TypeOrmModule.forFeature([Practice]), AuthModule, ConfigModule],
  controllers: [PracticeController],
  providers: [PracticeService, PracticeRepository, ConfigService],
  exports: [PracticeRepository],
})
export class PracticeModule {}
