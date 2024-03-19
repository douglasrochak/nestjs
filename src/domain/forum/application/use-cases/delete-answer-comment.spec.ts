import { MemoryAnswerCommentsRepo } from 'test/repositories/memory-answer-comments-repository';
import DeleteAnswerCommentUseCase from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { UniqueEntityID } from '@/core/entities';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

describe('Delete Answer Comment Use Case', () => {
  let repo: MemoryAnswerCommentsRepo;
  let sut: DeleteAnswerCommentUseCase;

  beforeEach(() => {
    repo = new MemoryAnswerCommentsRepo();
    sut = new DeleteAnswerCommentUseCase(repo);
  });

  it('Should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment();
    repo.create(answerComment);

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(repo.items).toHaveLength(0);
  });

  it('Should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-01'),
    });
    repo.create(answerComment);

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(repo.items).toHaveLength(1);
  });
});
