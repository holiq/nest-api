import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthInterface } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthInterface> {
    return await this.registerService.register(registerDto);
  }
}
