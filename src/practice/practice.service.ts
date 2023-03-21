import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Practice } from 'src/typeorm/entities/Practice.entity';
import { PracticeRepository } from 'src/typeorm/repositories/Practice.repository';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { isUUID } from 'class-validator';
import { FullDetailPractice } from './dto/saveList-practice.dto';

@Injectable()
export class PracticeService {
  constructor(private readonly practiceRepository: PracticeRepository) {}

  createPractice(createPracticeDto: CreatePracticeDto): Promise<Practice> {
    return this.practiceRepository.createPractice(createPracticeDto);
  }

  getPractices(): Promise<Practice[]> {
    return this.practiceRepository.getPractices();
  }

  async getPracticeById(id: string): Promise<Practice> {
    if (id && !isUUID(id))
      throw new NotFoundException(`Id ${id} is not in correct format`);
    try {
      const found = this.practiceRepository.findOne({
        where: { id },
      });
      if (!found)
        throw new NotFoundException(`Practice with id ${id} not found`);
      return found;
    } catch (error) {
      return error;
    }
  }

  async updatePractice(
    id: string,
    practiceDto: CreatePracticeDto,
  ): Promise<Practice> {
    const practice = await this.getPracticeById(id);
    const { title, description } = practiceDto;
    practice.title = title;
    practice.description = description;
    await this.practiceRepository.save(practice);

    return practice;
  }

  async deletePractice(id: string): Promise<void> {
    const result = await this.practiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Practice with id ${id} is not found`);
    }
  }
  async saveList(fullDetailDto: FullDetailPractice[]): Promise<string> {
    try {
      for (let index = 0; index < fullDetailDto.length; index++) {
        const newPractice: CreatePracticeDto = {
          title: fullDetailDto[index].title,
          description: fullDetailDto[index].description,
        };
        if (fullDetailDto[index].opt === 'new') {
          this.createPractice(newPractice);
        } else if (fullDetailDto[index].opt === 'edit') {
          this.updatePractice(fullDetailDto[index].id, newPractice);
        } else if (fullDetailDto[index].opt === 'delete') {
          this.deletePractice(fullDetailDto[index].id);
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Operation failed', error);
    }
    return 'SuccessFully Updated!';
  }
}
