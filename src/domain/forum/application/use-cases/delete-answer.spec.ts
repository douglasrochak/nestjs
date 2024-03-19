import { MemoryAnswersRepo } from 'test/repositories/memory-answers-repository';
import DeleteAnswerUseCase from './delete-answer';
import { UniqueEntityID } from '@/core/entities';
import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { MemoryAnswerAttachmentsRepo } from 'test/repositories/memory-answer-attachments-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

describe('Delete Answer Use Case', () => {
  let answersRepo: MemoryAnswersRepo;
  let answerAttachmentsRepo: MemoryAnswerAttachmentsRepo;
  let sut: DeleteAnswerUseCase;

  beforeEach(() => {
    answerAttachmentsRepo = new MemoryAnswerAttachmentsRepo();
    answersRepo = new MemoryAnswersRepo(answerAttachmentsRepo);
    sut = new DeleteAnswerUseCase(answersRepo);
  });

  it('Should be able to delete answer', async () => {
    const ID = 'answer-id';

    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-id') },
      new UniqueEntityID(ID),
    );

    answerAttachmentsRepo.items.push(
      makeAnswerAttachment({ answerId: new UniqueEntityID('answer-id') }),
      makeAnswerAttachment({ answerId: new UniqueEntityID('answer-id') }),
    );

    await answersRepo.create(newAnswer);

    expect(answerAttachmentsRepo.items).toHaveLength(2);
    expect(answersRepo.items).toHaveLength(1);

    await sut.execute({
      answerId: ID,
      authorId: 'author-id',
    });

    expect(answerAttachmentsRepo.items).toHaveLength(0);
    expect(answersRepo.items).toHaveLength(0);
  });

  it('Should not be able to delete answer with different authorId', async () => {
    const id = 'answer-id';
    const newAnswer = makeAnswer({}, new UniqueEntityID(id));
    await answersRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: id,
      authorId: 'author-id',
    });

    expect(answersRepo.items).toHaveLength(1);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
