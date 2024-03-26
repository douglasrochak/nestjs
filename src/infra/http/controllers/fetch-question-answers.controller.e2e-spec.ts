import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch question answers E2E', () => {
  let app: INestApplication;
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
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[GET] /question/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent({});
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await Promise.all(
      new Array(21).fill(undefined).map((_, i) =>
        answerFactory.makePrismaAnswer({
          authorId: user.id,
          questionId: question.id,
          content: `Conteudo não editado ${i}`,
        }),
      ),
    );

    const result = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/answers`)
      .set({ Authorization: `Bearer ${accessToken}` });

    const resultSecondPage = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/answers`)
      .query({ p: 2 })
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(result.statusCode).toBe(200);
    expect(result.body.answers).toHaveLength(20);
    expect(resultSecondPage.body.answers).toHaveLength(1);
  });
});
