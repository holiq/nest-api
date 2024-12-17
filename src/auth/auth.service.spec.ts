import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthInterface } from './interface/auth.interface';

describe('RegisterService', (): void => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should hash the password, create a user, and return AuthInterface', async (): Promise<void> => {
    const registerDto: RegisterDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    };

    const hashedPassword = 'hashed-password123';

    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      createdAt: new Date(),
    };

    const jwt: string = 'jwt-token';

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve(hashedPassword));

    mockUserService.create.mockResolvedValue(user);
    mockJwtService.signAsync.mockResolvedValue(jwt);

    const result: AuthInterface = await service.register(registerDto);

    expect(result).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token: jwt,
    });

    expect(mockUserService.create).toHaveBeenCalledWith({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    expect(mockJwtService.signAsync).toHaveBeenCalledWith(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: expect.any(String),
      },
    );
  });

  it('login a user, and return AuthInterface', async (): Promise<void> => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'password',
    };

    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
    };

    const jwt: string = 'jwt-token';

    mockUserService.findByEmail.mockResolvedValue(user);
    mockJwtService.signAsync.mockResolvedValue(jwt);

    const result: AuthInterface = await service.login(loginDto);

    expect(result).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token: jwt,
    });

    expect(mockUserService.findByEmail).toHaveBeenCalledWith(loginDto.email);

    expect(mockJwtService.signAsync).toHaveBeenCalledWith(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: expect.any(String),
      },
    );
  });
});
