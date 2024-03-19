import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities';

export class MemoryAnswerCommentsRepo implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);
    if (!answerComment) return null;
    return answerComment;
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );

    this.items.splice(answerIndex, 1);
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answers = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}
