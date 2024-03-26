import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Answer question E2E', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[POST] /questions/questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '1234567',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Pergunta 1',
    });

    const result = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .send({
        content: 'Conteudo da resposta',
      })
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(result.statusCode).toBe(201);
    const answers = await prisma.answer.findMany();

    expect(answers).toEqual([
      expect.objectContaining({
        questionId: question.id.toString(),
        content: 'Conteudo da resposta',
      }),
    ]);
    //
  });
});
