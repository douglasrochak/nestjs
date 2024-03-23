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

describe('Create question E2E', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '1234567',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const result = await request(app.getHttpServer())
      .post('/questions')
      .send({
        title: 'Nova pergunta',
        content: 'Conteudo da pergunta',
      })
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(result.statusCode).toBe(201);

    const questions = await prisma.question.findMany();

    expect(questions).toEqual([
      expect.objectContaining({
        title: 'Nova pergunta',
        content: 'Conteudo da pergunta',
      }),
    ]);
    //
  });
});
