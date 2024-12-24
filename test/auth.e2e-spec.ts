import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const BASE_URL: string = '/auth';
  const loginDto = {
    email: 'jane.doe@example.com',
    password: 'securepassword',
  };
  const registerDto = {
    name: 'Jane Doe',
    ...loginDto,
  };

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

  it('POST /auth/register - should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
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

  it('POST /auth/login - should log in an existing user', async () => {
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto);

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
  });

  it('POST /auth/login - should fail with invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send({ email: loginDto.email, password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('POST /auth/register - should fail for duplicate registration', async () => {
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(registerDto);

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body.message).toBe('Email Already Exists');
  });
});
