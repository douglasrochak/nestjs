import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch answer comments E2E', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);
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

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    // Make 21 Answer comments
    await Promise.all(
      new Array(21).fill(undefined).map((_, i) =>
        answerCommentFactory.makePrismaAnswerComment({
          authorId: user.id,
          answerId: answer.id,
          content: `Comentario ${i}`,
        }),
      ),
    );

    const resultPageTwo = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .query({ p: 2 })
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(resultPageTwo.body.answerComments).toHaveLength(1);

    const result = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set({ Authorization: `Bearer ${accessToken}` });

    console.log(result.body);
    expect(result.statusCode).toBe(200);
    expect(result.body.answerComments).toHaveLength(20);
    //
  });
});
