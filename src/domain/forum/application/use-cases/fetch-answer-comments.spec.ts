import { MemoryAnswerCommentsRepo } from 'test/repositories/memory-answer-comments-repository';
import FetchAnswerCommentsUseCase from './fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { UniqueEntityID } from '@/core/entities';

describe('Fetch Answer Comments Use Case', () => {
  let repo: MemoryAnswerCommentsRepo;
  let sut: FetchAnswerCommentsUseCase;

  beforeEach(() => {
    repo = new MemoryAnswerCommentsRepo();
    sut = new FetchAnswerCommentsUseCase(repo);
  });

  it('Should be able to fetch answer comments', async () => {
    const answerId = new UniqueEntityID('answer-1');
    await repo.create(makeAnswerComment({ answerId }));
    await repo.create(makeAnswerComment({ answerId }));
    await repo.create(makeAnswerComment({ answerId }));

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(3);
  });

  it('Should be able to fetch paginated answer comments', async () => {
    const answerId = new UniqueEntityID('answer-1');
    for (let i = 0; i < 22; i++) {
      await repo.create(makeAnswerComment({ answerId }));
    }

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(2);
  });
});
