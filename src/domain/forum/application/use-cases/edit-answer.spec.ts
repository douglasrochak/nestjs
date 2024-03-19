import { MemoryAnswersRepo } from 'test/repositories/memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import EditAnswerUseCase from './edit-answer';
import { UniqueEntityID } from '@/core/entities';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { MemoryAnswerAttachmentsRepo } from 'test/repositories/memory-answer-attachments-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

describe('Edit Answer Use Case', () => {
  let answersRepo: MemoryAnswersRepo;
  let answerAttachmentsRepo: MemoryAnswerAttachmentsRepo;
  let sut: EditAnswerUseCase;

  beforeEach(() => {
    answerAttachmentsRepo = new MemoryAnswerAttachmentsRepo();
    answersRepo = new MemoryAnswersRepo(answerAttachmentsRepo);
    sut = new EditAnswerUseCase(answersRepo, answerAttachmentsRepo);
  });

  it('Should be able to edit a answer', async () => {
    const ID = 'answer-id';
    const CONTENT = 'Test Content';

    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-id') },
      new UniqueEntityID(ID),
    );
    await answersRepo.create(newAnswer);

    answerAttachmentsRepo.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('5'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    await sut.execute({
      answerId: ID,
      authorId: 'author-id',
      content: CONTENT,
      attachmentsIds: ['1', '3'],
    });

    expect(answersRepo.items[0]).toEqual(
      expect.objectContaining({
        content: CONTENT,
      }),
    );
    expect(answersRepo.items[0].attachments.currentItems).toHaveLength(2);
    expect(answersRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3'),
      }),
    ]);
  });

  it('Should not be able to edit a answer with different authorId', async () => {
    const ID = 'answer-id';
    const CONTENT = 'Test Content';

    const newAnswer = makeAnswer(
      { content: 'Answer content' },
      new UniqueEntityID(ID),
    );
    await answersRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: ID,
      authorId: 'author-id',
      content: CONTENT,
      attachmentsIds: [],
    });

    expect(answersRepo.items[0]).toEqual(
      expect.objectContaining({
        content: 'Answer content',
      }),
    );
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
