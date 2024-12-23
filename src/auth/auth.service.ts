import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
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

    const token: string = await this.generateToken(user);

    const { password: _, ...result } = user;

    return {
      user: result,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthInterface> {
    const user: User = await this.user.findByEmail(loginDto.email);

    if (!user || !(await this.hashCompare(loginDto.password, user.password))) {
      throw new UnauthorizedException();
    }

    const token: string = await this.generateToken(user);

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

  async hashCompare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateToken(payload: User): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: payload.id,
        email: payload.email,
      },
      {
        secret: `${process.env.JWT_SECRET_KEY}`,
      },
    );
  }
}
