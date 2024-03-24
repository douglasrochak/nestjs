import { Slug } from '@/domain/forum/enterprise/entities/shared';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch recent questions E2E', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '1234567',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Nova pergunta 1',
        content: 'Conteudo da pergunta',
        slug: Slug.create('question-01'),
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Nova pergunta 2',
        content: 'Conteudo da pergunta',
        slug: Slug.create('question-02'),
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Nova pergunta 3',
        content: 'Conteudo da pergunta',
        slug: Slug.create('question-03'),
      }),
    ]);

    const result = await request(app.getHttpServer())
      .get('/questions')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: 'Nova pergunta 1',
        }),
        expect.objectContaining({
          title: 'Nova pergunta 2',
        }),
        expect.objectContaining({
          title: 'Nova pergunta 3',
        }),
      ]),
    });
    //
  });
});
