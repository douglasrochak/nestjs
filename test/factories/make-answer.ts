import { UniqueEntityID } from '@/core/entities';
import { Answer } from '@/domain/forum/enterprise/entities';
import { AnswerProps } from '@/domain/forum/enterprise/entities/answer';
import { faker } from '@faker-js/faker';

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
