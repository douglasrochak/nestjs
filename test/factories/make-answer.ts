import { UniqueEntityID } from '@/core/entities';
import { Answer } from '@/domain/forum/enterprise/entities';
import { AnswerProps } from '@/domain/forum/enterprise/entities/answer';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      questionId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
