import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

describe('Fetch recent questions E2E', () => {
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

  test('[GET] /questions', async () => {
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
          content: 'Conteudo da pergunta',
          slug: 'question-02',
        },
        {
          authorId: user.id,
          title: 'Nova pergunta 3',
          content: 'Conteudo da pergunta',
          slug: 'question-03',
        },
      ],
    });

    const result = await request(app.getHttpServer())
      .get('/questions')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'Nova pergunta 1',
        }),
        expect.objectContaining({
          title: 'Nova pergunta 2',
        }),
        expect.objectContaining({
          title: 'Nova pergunta 3',
        }),
      ],
    });
    //
  });
});
