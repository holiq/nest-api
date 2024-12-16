import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthInterface } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private user: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthInterface> {
    const hashedPassword: string = await this.hasPassword(registerDto.password);

    const user: User = await this.user.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    const token: string = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: `${process.env.JWT_SECRET_KEY}`,
      },
    );

    const { password: _, ...result } = user;

    return {
      user: result,
      token,
    };
  }

  async hasPassword(password: string): Promise<string> {
    const saltRound: number = 10;

    return await bcrypt.hash(password, saltRound);
  }
}
