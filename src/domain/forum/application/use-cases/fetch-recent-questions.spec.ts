import { MemoryQuestionsRepo } from 'test/repositories/memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import FetchRecentQuestionsUseCase from './fetch-recent-questions';
import { MemoryQuestionAttachmentsRepo } from 'test/repositories/memory-question-attachments-repository';

describe('Fetch Recent Questions Use Case', () => {
  let questionsRepo: MemoryQuestionsRepo;
  let questionAttachmentsRepo: MemoryQuestionAttachmentsRepo;
  let sut: FetchRecentQuestionsUseCase;

  beforeEach(() => {
    questionAttachmentsRepo = new MemoryQuestionAttachmentsRepo();
    questionsRepo = new MemoryQuestionsRepo(questionAttachmentsRepo);
    sut = new FetchRecentQuestionsUseCase(questionsRepo);
  });

  it('Should be able to fetch recent questions', async () => {
    await questionsRepo.create(
      makeQuestion({ createdAt: new Date(2023, 0, 20) }),
    );
    await questionsRepo.create(
      makeQuestion({ createdAt: new Date(2023, 0, 25) }),
    );
    await questionsRepo.create(
      makeQuestion({ createdAt: new Date(2023, 0, 18) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 25) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 18) }),
    ]);
  });

  it('Should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await questionsRepo.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
