import { Test, TestingModule } from '@nestjs/testing';
import { AuthInterface } from 'src/auth/interface/auth.interface';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

describe('RegisterController', (): void => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
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

  it('should call service.execute with correct parameters', async (): Promise<void> => {
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
});
