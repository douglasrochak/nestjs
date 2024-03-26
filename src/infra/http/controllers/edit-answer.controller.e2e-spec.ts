import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Edit Answer E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[POST] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent({});

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
      content: 'Conteudo não editado',
    });

    const result = await request(app.getHttpServer())
      .post(`/answers/${answer.id.toString()}`)
      .send({
        content: 'Conteudo editado',
        attachmentsIds: [],
      })
      .set({ Authorization: `Bearer ${accessToken}` });

    const prismaAnswer = await prisma.answer.findUnique({
      where: { id: answer.id.toString() },
    });

    expect(result.statusCode).toBe(204);
    expect(prismaAnswer).toEqual(
      expect.objectContaining({
        id: answer.id.toString(),
        content: 'Conteudo editado',
      }),
    );
  });
});
