import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserPracticeService } from './user-practice.service';
import { AssignedPracticeDto } from './dto/assign-practice.dto';

@Controller('user-practice')
export class UserPracticeController {
  constructor(private userPracticeService: UserPracticeService) {}

  @Get()
  async getUserPractices() {
    return this.userPracticeService.getUserPractices();
  }

  @Post('/assignPractice')
  assignPractice(
    @Body() assignPractices: AssignedPracticeDto[],
  ): Promise<string> {
    return this.userPracticeService.handlePracticeToUsers(assignPractices);
  }
}
