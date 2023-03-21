import { Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common/decorators';

import { Practice } from 'src/typeorm/entities/Practice.entity';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { FullDetailPractice } from './dto/saveList-practice.dto';
import { PracticeService } from './practice.service';

@Controller('practices')
export class PracticeController {
  constructor(private practiceService: PracticeService) {}
  @Post()
  createPractice(
    @Body() createPracticeDto: CreatePracticeDto,
  ): Promise<Practice> {
    return this.practiceService.createPractice(createPracticeDto);
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
  saveList(@Body() saveListDto: FullDetailPractice[]): Promise<string> {
    return this.practiceService.saveList(saveListDto);
  }
}
