import { Slug } from '@/domain/forum/enterprise/entities/shared';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Edit Question E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
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

  test('[POST] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '1234567',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Nova pergunta 1',
      content: 'Conteudo da pergunta',
      slug: Slug.create('question-01'),
    });

    const result = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}`)
      .send({
        title: 'Pergunta editada',
        content: 'Conteudo da pergunta editada',
      })
      .set({ Authorization: `Bearer ${accessToken}` });

    const prismaQuestion = await prisma.question.findUnique({
      where: { id: question.id.toString() },
    });

    expect(result.statusCode).toBe(201);
    expect(prismaQuestion).toEqual(
      expect.objectContaining({
        id: question.id.toString(),
        title: 'Pergunta editada',
        content: 'Conteudo da pergunta editada',
      }),
    );
  });
});
