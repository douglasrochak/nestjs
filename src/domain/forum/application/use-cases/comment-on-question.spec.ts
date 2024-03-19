import { MemoryQuestionsRepo } from 'test/repositories/memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { MemoryQuestionCommentsRepo } from 'test/repositories/memory-question-comments-repository';
import CommentOnQuestionUseCase from './comment-on-question';
import { MemoryQuestionAttachmentsRepo } from 'test/repositories/memory-question-attachments-repository';

describe('Comment on Question Use Case', () => {
  let questionAttachmentsRepo: MemoryQuestionAttachmentsRepo;
  let questionRepo: MemoryQuestionsRepo;
  let questionCommentsRepo: MemoryQuestionCommentsRepo;
  let sut: CommentOnQuestionUseCase;

  beforeEach(() => {
    questionAttachmentsRepo = new MemoryQuestionAttachmentsRepo();
    questionRepo = new MemoryQuestionsRepo(questionAttachmentsRepo);
    questionCommentsRepo = new MemoryQuestionCommentsRepo();
    sut = new CommentOnQuestionUseCase(questionRepo, questionCommentsRepo);
  });

  it('Should be able to comment on question', async () => {
    const question = makeQuestion();
    questionRepo.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Test Comment',
    });

    expect(questionCommentsRepo.items[0].content).toEqual('Test Comment');
  });
});
