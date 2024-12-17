import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthInterface } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthInterface> {
    return await this.authService.register(registerDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<AuthInterface> {
    return await this.authService.login(loginDto);
  }
}
