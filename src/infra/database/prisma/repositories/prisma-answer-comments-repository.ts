import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const maxPerPage = 20;

    const answerComments = await this.prisma.comment.findMany({
      where: { answerId },
      take: maxPerPage,
      skip: (page - 1) * maxPerPage,
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!answerComment) return null;

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const prismaAnswerComment =
      PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({ data: prismaAnswerComment });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: answerComment.id.toString() },
    });
  }
}
