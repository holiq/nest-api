import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthInterface } from './interface/auth.interface';

describe('RegisterController', (): void => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.register with correct parameters', async (): Promise<void> => {
    const registerDto: RegisterDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    };

    const user: AuthInterface = {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      },
      token: 'mock-jwt-token',
    };

    mockAuthService.register.mockResolvedValue(user);

    const result: AuthInterface = await controller.register(registerDto);

    expect(result).toEqual(user);
    expect(service.register).toHaveBeenCalledWith(registerDto);
  });

  it('should call service.login with correct parameters', async (): Promise<void> => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'password',
    };

    const user: AuthInterface = {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      },
      token: 'mock-jwt-token',
    };

    mockAuthService.login.mockResolvedValue(user);

    const result: AuthInterface = await controller.login(loginDto);

    expect(result).toEqual(user);
    expect(service.login).toHaveBeenCalledWith(loginDto);
  });
});
