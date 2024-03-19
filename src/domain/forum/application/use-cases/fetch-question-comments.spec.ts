import { MemoryQuestionCommentsRepo } from 'test/repositories/memory-question-comments-repository';
import FetchQuestionCommentsUseCase from './fetch-question-comments';
import { UniqueEntityID } from '@/core/entities';
import { makeQuestionComment } from 'test/factories/make-question-comment';

describe('Fetch Question Comments Use Case', () => {
  let repo: MemoryQuestionCommentsRepo;
  let sut: FetchQuestionCommentsUseCase;

  beforeEach(() => {
    repo = new MemoryQuestionCommentsRepo();
    sut = new FetchQuestionCommentsUseCase(repo);
  });

  it('Should be able to fetch question comments', async () => {
    const questionId = new UniqueEntityID('question-1');
    await repo.create(makeQuestionComment({ questionId }));
    await repo.create(makeQuestionComment({ questionId }));
    await repo.create(makeQuestionComment({ questionId }));

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('Should be able to fetch paginated question comments', async () => {
    const questionId = new UniqueEntityID('question-1');
    for (let i = 0; i < 22; i++) {
      await repo.create(makeQuestionComment({ questionId }));
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
