import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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

  it('/auth/login (POST) - should auth a new user', async () => {
    const loginDto = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'securepassword',
    };

    await request(app.getHttpServer()).post('/auth/register').send(loginDto);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      user: {
        id: expect.any(Number),
        name: loginDto.name,
        email: loginDto.email,
        createdAt: expect.any(String),
      },
      token: expect.any(String),
    });
  });
});
