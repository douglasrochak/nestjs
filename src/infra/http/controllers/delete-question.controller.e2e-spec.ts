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

  test('[DELETE] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '1234567',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Nova pergunta não deletada',
    });

    const questionToDelete = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Nova pergunta 2',
    });

    const result = await request(app.getHttpServer())
      .delete(`/questions/${questionToDelete.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` });

    const prismaQuestions = await prisma.question.findMany({});

    expect(result.statusCode).toBe(204);
    expect(prismaQuestions).toHaveLength(1);
    expect(prismaQuestions).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: questionToDelete.id.toString() }),
      ]),
    );
  });
});
