import { Controller, UseGuards } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

import { Practice } from 'src/typeorm/entities/Practice.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { FullDetailPractice } from './dto/saveList-practice.dto';
import { PracticeService } from './practice.service';

@Controller('practices')
@UseGuards(AuthGuard())
export class PracticeController {
  constructor(private practiceService: PracticeService) {}
  @Post()
  createPractice(
    @Body() createPracticeDto: CreatePracticeDto,
    @GetUser() user: User,
  ): Promise<Practice> {
    return this.practiceService.createPractice(createPracticeDto, user);
  }

  @Get()
  getPractices(): Promise<Practice[]> {
    return this.practiceService.getPractices();
  }

  @Get('/:id')
  getPracticeById(@Param('id') id: string): Promise<Practice> {
    return this.practiceService.getPracticeById(id);
  }

  @Patch('/:id')
  updatePractice(
    @Param('id') id: string,
    @Body() createPracticeDto: CreatePracticeDto,
  ): Promise<Practice> {
    return this.practiceService.updatePractice(id, createPracticeDto);
  }

  @Delete('/:id')
  deletePractice(@Param('id') id: string): Promise<void> {
    return this.practiceService.deletePractice(id);
  }

  @Post('/saveList')
  saveList(
    @Body() saveListDto: FullDetailPractice[],
    @GetUser() user: User,
  ): Promise<string> {
    return this.practiceService.saveList(saveListDto, user);
  }
}
