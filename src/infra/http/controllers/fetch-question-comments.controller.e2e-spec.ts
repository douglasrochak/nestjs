import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch questions comments E2E', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[GET] /questions/:id/comments', async () => {
    const user = await studentFactory.makePrismaStudent({});
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    // Make 21 Question comments
    await Promise.all(
      new Array(21).fill(undefined).map((_, i) =>
        questionCommentFactory.makePrismaQuestionComment({
          authorId: user.id,
          questionId: question.id,
          content: `Comentario ${i}`,
        }),
      ),
    );

    const resultPageTwo = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .query({ p: 2 })
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(resultPageTwo.body.questionComments).toHaveLength(1);

    const result = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(result.statusCode).toBe(200);
    expect(result.body.questionComments).toHaveLength(20);
    //
  });
});
