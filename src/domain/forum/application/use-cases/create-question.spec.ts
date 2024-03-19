import { MemoryQuestionsRepo } from 'test/repositories/memory-questions-repository';
import CreateQuestionUseCase from './create-question';
import { UniqueEntityID } from '@/core/entities';
import { MemoryQuestionAttachmentsRepo } from 'test/repositories/memory-question-attachments-repository';

describe('Create Question', () => {
  let questionRepo: MemoryQuestionsRepo;
  let questionAttachmentsRepo: MemoryQuestionAttachmentsRepo;
  let sut: CreateQuestionUseCase;

  beforeEach(() => {
    questionAttachmentsRepo = new MemoryQuestionAttachmentsRepo();
    questionRepo = new MemoryQuestionsRepo(questionAttachmentsRepo);
    sut = new CreateQuestionUseCase(questionRepo);
  });

  it('should be able to create an question', async () => {
    const result = await sut.execute({
      authorId: 'fake-author-id',
      title: 'Question 1',
      content: 'Question content',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toEqual(true);
    expect(questionRepo.items[0].id).toEqual(result.value?.question.id);
    expect(questionRepo.items[0].attachments.currentItems).toHaveLength(2);
    expect(questionRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        questionId: result.value?.question.id,
      }),
      expect.objectContaining({
        questionId: result.value?.question.id,
      }),
    ]);
    expect(questionRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
});
