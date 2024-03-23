import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

describe('Get Question By Slug E2E', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '1234567',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          authorId: user.id,
          title: 'Nova pergunta 1',
          content: 'Conteudo da pergunta',
          slug: 'question-01',
        },
        {
          authorId: user.id,
          title: 'Nova pergunta 2',
          content: 'Conteudo da pergunta 2',
          slug: 'question-02',
        },
      ],
    });

    const result = await request(app.getHttpServer())
      .get('/questions/question-02')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      question: expect.objectContaining({
        title: 'Nova pergunta 2',
        content: 'Conteudo da pergunta 2',
        slug: 'question-02',
      }),
    });
    //
  });
});
