import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('RegisterController (e2e)', () => {
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

  it('/register (POST) - should register a new user', async () => {
    const registerDto = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'securepassword',
    };

    const response = await request(app.getHttpServer())
      .post('/register')
      .send(registerDto)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: registerDto.name,
      email: registerDto.email,
      password: expect.any(String),
    });

    const userInDb: User = await prismaService.user.findUnique({
      where: { email: registerDto.email },
    });

    expect(userInDb).toBeDefined();
    expect(userInDb.name).toEqual(registerDto.name);
    expect(userInDb.email).toEqual(registerDto.email);
  });

  it('/register (POST) - should return 400 if input validation fails', async () => {
    const invalidRegisterDto = {
      name: '',
      email: 'not-an-email',
      password: 'short',
    };

    const response = await request(app.getHttpServer())
      .post('/register')
      .send(invalidRegisterDto)
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: expect.any(Array),
      error: 'Bad Request',
    });
  });
});
