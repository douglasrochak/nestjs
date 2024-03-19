import { MemoryQuestionsRepo } from 'test/repositories/memory-questions-repository';
import GetQuestionBySlugUseCase from './get-question-by-slug';
import { makeQuestion } from 'test/factories/make-question';
import { Slug } from '../../enterprise/entities/shared';
import { MemoryQuestionAttachmentsRepo } from 'test/repositories/memory-question-attachments-repository';

describe('Get Question By Slug Use Case', () => {
  let questionsRepo: MemoryQuestionsRepo;
  let questionAttachmentsRepo: MemoryQuestionAttachmentsRepo;
  let sut: GetQuestionBySlugUseCase;

  beforeEach(() => {
    questionAttachmentsRepo = new MemoryQuestionAttachmentsRepo();
    questionsRepo = new MemoryQuestionsRepo(questionAttachmentsRepo);
    sut = new GetQuestionBySlugUseCase(questionsRepo);
  });

  it('Should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    });

    await questionsRepo.create(newQuestion);

    const result = await sut.execute({
      slug: 'example-question',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    });
  });
});
