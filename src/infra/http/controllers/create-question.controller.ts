import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.slugify(title);

    await this.prisma.question.create({
      data: { authorId: userId, title, content, slug },
    });
  }

  private slugify(str: string, separator = '-') {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove non-word characters
      .replace(/\s+/g, separator); // Replace whitespace with separator
  }
}
