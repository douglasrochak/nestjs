import { MemoryAnswersRepo } from 'test/repositories/memory-answers-repository';
import { UniqueEntityID } from '@/core/entities';
import { makeAnswer } from 'test/factories/make-answer';
import { MemoryQuestionsRepo } from 'test/repositories/memory-questions-repository';
import ChooseQuestionBestAnswerUseCase from './choose-question-best-answer';
import { makeQuestion } from 'test/factories/make-question';
import { MemoryQuestionAttachmentsRepo } from 'test/repositories/memory-question-attachments-repository';
import { MemoryAnswerAttachmentsRepo } from 'test/repositories/memory-answer-attachments-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

describe('Choose Question Best Answer Use Case', () => {
  let answerAttachmentsRepo: MemoryAnswerAttachmentsRepo;
  let answersRepo: MemoryAnswersRepo;
  let questionsRepo: MemoryQuestionsRepo;
  let questionAttachmentsRepo: MemoryQuestionAttachmentsRepo;
  let sut: ChooseQuestionBestAnswerUseCase;

  beforeEach(() => {
    questionAttachmentsRepo = new MemoryQuestionAttachmentsRepo();
    questionsRepo = new MemoryQuestionsRepo(questionAttachmentsRepo);
    answerAttachmentsRepo = new MemoryAnswerAttachmentsRepo();
    answersRepo = new MemoryAnswersRepo(answerAttachmentsRepo);
    sut = new ChooseQuestionBestAnswerUseCase(questionsRepo, answersRepo);
  });

  it('Should be able to choose question best answer', async () => {
    const question = makeQuestion();

    const answer = makeAnswer({
      questionId: question.id,
    });

    questionsRepo.create(question);
    answersRepo.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(questionsRepo.items[0].bestAnswerId).toEqual(answer.id);
  });

  it('Should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-id-1'),
    });

    const answer = makeAnswer({
      questionId: question.id,
    });

    questionsRepo.create(question);
    answersRepo.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'not-same-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
