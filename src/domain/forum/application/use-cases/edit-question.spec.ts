import { MemoryQuestionsRepo } from 'test/repositories/memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import EditQuestionUseCase from './edit-question';
import { UniqueEntityID } from '@/core/entities';
import { MemoryQuestionAttachmentsRepo } from 'test/repositories/memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

describe('Edit Question Use Case', () => {
  let questionsRepo: MemoryQuestionsRepo;
  let questionsAttachmentsRepo: MemoryQuestionAttachmentsRepo;
  let sut: EditQuestionUseCase;

  beforeEach(() => {
    questionsAttachmentsRepo = new MemoryQuestionAttachmentsRepo();
    questionsRepo = new MemoryQuestionsRepo(questionsAttachmentsRepo);
    sut = new EditQuestionUseCase(questionsRepo, questionsAttachmentsRepo);
  });

  it('Should be able to edit a question', async () => {
    const ID = 'question-id';
    const TITLE = 'Test Question';
    const CONTENT = 'Test Content';

    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-id') },
      new UniqueEntityID(ID),
    );
    await questionsRepo.create(newQuestion);

    questionsAttachmentsRepo.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    const result = await sut.execute({
      questionId: ID,
      authorId: 'author-id',
      title: TITLE,
      content: CONTENT,
      attachmentsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(questionsRepo.items[0]).toEqual(
      expect.objectContaining({
        title: TITLE,
      }),
    );
    expect(questionsRepo.items[0].attachments.currentItems).toHaveLength(2);
    expect(questionsRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3'),
      }),
    ]);
  });

  it('Should not be able to edit a question with different authorId', async () => {
    const ID = 'question-id';
    const TITLE = 'Test Question';
    const CONTENT = 'Test Content';

    const newQuestion = makeQuestion(
      { title: 'Question title' },
      new UniqueEntityID(ID),
    );
    await questionsRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: ID,
      authorId: 'author-id',
      title: TITLE,
      content: CONTENT,
      attachmentsIds: [],
    });
    expect(questionsRepo.items[0]).toEqual(
      expect.objectContaining({
        title: 'Question title',
      }),
    );
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
