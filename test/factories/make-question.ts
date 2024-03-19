import { UniqueEntityID } from '@/core/entities';
import { Question } from '@/domain/forum/enterprise/entities';
import { QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/shared';
import { faker } from '@faker-js/faker';

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
