import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '../../enterprise/entities';

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>;
  findById(id: string): Promise<AnswerComment | null>;
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
  delete(questionComment: AnswerComment): Promise<void>;
}
