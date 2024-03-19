import { makeAnswer } from 'test/factories/make-answer';
import FetchQuestionAnswersUseCase from './fetch-question-answers';
import { MemoryAnswersRepo } from 'test/repositories/memory-answers-repository';
import { UniqueEntityID } from '@/core/entities';
import { MemoryAnswerAttachmentsRepo } from 'test/repositories/memory-answer-attachments-repository';

describe('Fetch Question Answers Use Case', () => {
  let answersRepo: MemoryAnswersRepo;
  let answerAttachmentsRepo: MemoryAnswerAttachmentsRepo;
  let sut: FetchQuestionAnswersUseCase;

  beforeEach(() => {
    answerAttachmentsRepo = new MemoryAnswerAttachmentsRepo();
    answersRepo = new MemoryAnswersRepo(answerAttachmentsRepo);
    sut = new FetchQuestionAnswersUseCase(answersRepo);
  });

  it('Should be able to fetch question answers', async () => {
    const questionId = new UniqueEntityID('question-1');
    await answersRepo.create(makeAnswer({ questionId }));
    await answersRepo.create(makeAnswer({ questionId }));
    await answersRepo.create(makeAnswer({ questionId }));

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it('Should be able to fetch paginated question answers', async () => {
    const questionId = new UniqueEntityID('question-1');
    for (let i = 0; i < 22; i++) {
      await answersRepo.create(makeAnswer({ questionId }));
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
