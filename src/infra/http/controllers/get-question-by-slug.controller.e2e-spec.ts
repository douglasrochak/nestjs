import { Slug } from '@/domain/forum/enterprise/entities/shared';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Get Question By Slug E2E', () => {
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
    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '1234567',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Nova pergunta 1',
      content: 'Conteudo da pergunta',
      slug: Slug.create('question-01'),
    });

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Nova pergunta 2',
      content: 'Conteudo da pergunta 2',
      slug: Slug.create('question-02'),
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
  });
});
