import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePracticeDto } from 'src/practice/dto/create-practice.dto';
import { DataSource, Repository } from 'typeorm';
import { Practice } from '../entities/Practice.entity';
import { User } from '../entities/User.entity';

@Injectable()
export class PracticeRepository extends Repository<Practice> {
  constructor(private dataSource: DataSource) {
    super(Practice, dataSource.createEntityManager());
  }

  async getPractices(): Promise<Practice[]> {
    const query = this.createQueryBuilder('practice');
    const practices = await query.getMany();
    return practices;
  }


  async createPractice(
    createPracticeDto: CreatePracticeDto,
    user: User,
  ): Promise<Practice> {
    const practice = this.create({ ...createPracticeDto });
    try {
      await this.save(practice);
      return practice;
    } catch (error) {
      if (error.code === '23505') {
        // check for unique constraint violation error code
        throw new ConflictException('Quiz title already exists');
      }
      throw error;
    }
  }

  
}
