import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaService) {}

  execute(registerDto: RegisterDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      },
    });
  }
}
