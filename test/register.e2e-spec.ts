import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prismaService = app.get(PrismaService);

    await prismaService.user.deleteMany();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - should auth a new user', async () => {
    const registerDto = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'securepassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      user: {
        id: expect.any(Number),
        name: registerDto.name,
        email: registerDto.email,
        createdAt: expect.any(String),
      },
      token: expect.any(String),
    });

    const userInDb: User = await prismaService.user.findUnique({
      where: { email: registerDto.email },
    });

    expect(userInDb).toBeDefined();
    expect(userInDb.name).toEqual(registerDto.name);
    expect(userInDb.email).toEqual(registerDto.email);
  });
});
