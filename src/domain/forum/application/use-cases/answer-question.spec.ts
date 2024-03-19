import AnswerQuestionUseCase from './answer-question';
import { UniqueEntityID } from '@/core/entities';
import { MemoryAnswerAttachmentsRepo } from 'test/repositories/memory-answer-attachments-repository';
import { MemoryAnswersRepo } from 'test/repositories/memory-answers-repository';

describe('Answer Question Use Case', () => {
  let answersRepo: MemoryAnswersRepo;
  let answerAttachmentsRepo: MemoryAnswerAttachmentsRepo;
  let sut: AnswerQuestionUseCase;

  beforeEach(() => {
    answerAttachmentsRepo = new MemoryAnswerAttachmentsRepo();
    answersRepo = new MemoryAnswersRepo(answerAttachmentsRepo);
    sut = new AnswerQuestionUseCase(answersRepo);
  });

  it('should be able to create a answer', async () => {
    const result = await sut.execute({
      instructorId: 'fake-instructor-id',
      questionId: 'fake-question-id',
      content: 'Answer content',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toEqual(true);
    expect(answersRepo.items[0].id).toEqual(result.value?.answer.id);

    expect(answersRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
});
