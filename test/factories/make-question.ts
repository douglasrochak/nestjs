import { UniqueEntityID } from '@/core/entities';
import { Question } from '@/domain/forum/enterprise/entities';
import { QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/shared';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      slug: Slug.create('example-question'),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data);

    const { authorId, content, slug, title } =
      PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.create({
      data: {
        slug,
        content,
        title,
        authorId,
      },
    });

    return question;
  }
}
