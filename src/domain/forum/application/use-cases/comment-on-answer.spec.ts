import { MemoryAnswersRepo } from 'test/repositories/memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import CommentOnAnswerUseCase from './comment-on-answer';
import { MemoryAnswerCommentsRepo } from 'test/repositories/memory-answer-comments-repository';
import { MemoryAnswerAttachmentsRepo } from 'test/repositories/memory-answer-attachments-repository';

describe('Comment on Answer Use Case', () => {
  let answerRepo: MemoryAnswersRepo;
  let answerAttachmentsRepo: MemoryAnswerAttachmentsRepo;
  let answerCommentsRepo: MemoryAnswerCommentsRepo;
  let sut: CommentOnAnswerUseCase;

  beforeEach(() => {
    answerAttachmentsRepo = new MemoryAnswerAttachmentsRepo();
    answerRepo = new MemoryAnswersRepo(answerAttachmentsRepo);
    answerCommentsRepo = new MemoryAnswerCommentsRepo();
    sut = new CommentOnAnswerUseCase(answerRepo, answerCommentsRepo);
  });

  it('Should be able to comment on answer', async () => {
    const answer = makeAnswer();
    answerRepo.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Test Answer',
    });

    expect(answerCommentsRepo.items[0].content).toEqual('Test Answer');
  });
});
