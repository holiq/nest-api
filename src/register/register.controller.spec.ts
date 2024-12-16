import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

describe('RegisterController', (): void => {
  let controller: RegisterController;
  let service: RegisterService;

  const mockRegisterService = {
    execute: jest.fn(),
  };

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: RegisterService,
          useValue: mockRegisterService,
        },
      ],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    service = module.get<RegisterService>(RegisterService);
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

    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      createdAt: new Date(),
    };

    mockRegisterService.execute.mockResolvedValue(user);

    const result: User = await controller.execute(registerDto);

    expect(result).toEqual(user);
    expect(service.execute).toHaveBeenCalledWith(registerDto);
  });
});
