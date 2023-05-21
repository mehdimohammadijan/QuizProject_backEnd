import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPractice } from '../entities/UserPractice.entity';

@Injectable()
export class UserPracticeRepository extends Repository<UserPractice> {
  constructor(private dataSource: DataSource) {
    super(UserPractice, dataSource.createEntityManager());
  }
}
