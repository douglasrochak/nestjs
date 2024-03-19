import { MemoryQuestionCommentsRepo } from 'test/repositories/memory-question-comments-repository';
import DeleteQuestionCommentUseCase from './delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityID } from '@/core/entities';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

describe('Delete Question Comment Use Case', () => {
  let repo: MemoryQuestionCommentsRepo;
  let sut: DeleteQuestionCommentUseCase;

  beforeEach(() => {
    repo = new MemoryQuestionCommentsRepo();
    sut = new DeleteQuestionCommentUseCase(repo);
  });

  it('Should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment();
    repo.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(repo.items).toHaveLength(0);
  });

  it('Should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-01'),
    });
    repo.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-02',
    });

    expect(repo.items).toHaveLength(1);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
