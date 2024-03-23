import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const maxPerPage = 20;

    const questionComments = await this.prisma.comment.findMany({
      where: { questionId },
      take: maxPerPage,
      skip: (page - 1) * maxPerPage,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!questionComment) return null;

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const prismaQuestionComment =
      PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prisma.comment.create({ data: prismaQuestionComment });
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: questionComment.id.toString() },
    });
  }
}
