import { makeAnswer } from 'test/factories/make-answer';
import { MemoryAnswersRepo } from 'test/repositories/memory-answers-repository';
import { MemoryAnswerAttachmentsRepo } from 'test/repositories/memory-answer-attachments-repository';
import { MemoryQuestionsRepo } from 'test/repositories/memory-questions-repository';
import { MemoryQuestionAttachmentsRepo } from 'test/repositories/memory-question-attachments-repository';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases';
import { MemoryNotificationsRepo } from 'test/repositories/memory-notifications-repository';
import { makeQuestion } from 'test/factories/make-question';
import { MockInstance } from 'vitest';
import {
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification';
import { waitFor } from 'test/utils/wait-for';
import OnQuestionBestAnswerChosen from './on-question-best-answer-chosen';

let questionAttachmentsRepo: MemoryQuestionAttachmentsRepo;
let questionsRepo: MemoryQuestionsRepo;
let answerAttachmentsRepo: MemoryAnswerAttachmentsRepo;
let answersRepo: MemoryAnswersRepo;
let notificationRepo: MemoryNotificationsRepo;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Question Best Answer Chosen Event', () => {
  beforeEach(() => {
    questionAttachmentsRepo = new MemoryQuestionAttachmentsRepo();
    questionsRepo = new MemoryQuestionsRepo(questionAttachmentsRepo);
    answerAttachmentsRepo = new MemoryAnswerAttachmentsRepo();
    answersRepo = new MemoryAnswersRepo(answerAttachmentsRepo);
    notificationRepo = new MemoryNotificationsRepo();
    sendNotificationUseCase = new SendNotificationUseCase(notificationRepo);

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnQuestionBestAnswerChosen(answersRepo, sendNotificationUseCase);
  });

  it('Should send a notification when an answer is chosen as best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    questionsRepo.create(question);
    answersRepo.create(answer);

    question.bestAnswerId = answer.id;

    questionsRepo.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
