import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  execute(@Body() registerDto: RegisterDto): Promise<User> {
    return this.registerService.execute(registerDto);
  }
}
