import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './register.service';

describe('RegisterService', (): void => {
  let service: RegisterService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
    },
  };

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with correct data', async (): Promise<void> => {
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

    mockPrismaService.user.create.mockResolvedValue(user);

    const result: User = await service.execute(registerDto);

    expect(result).toEqual(user);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      },
    });
  });
});
