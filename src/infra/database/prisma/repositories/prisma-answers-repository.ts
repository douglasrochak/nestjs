import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } });

    if (!answer) return null;

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const maxPerPage = 20;

    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      take: maxPerPage,
      skip: (page - 1) * maxPerPage,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({ data });
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() },
    });
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.update({
      where: { id: answer.id.toString() },
      data,
    });
  }
}
