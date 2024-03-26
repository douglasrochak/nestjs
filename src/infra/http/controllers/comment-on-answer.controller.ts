import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases';

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Param('answerId') answerId: string,
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema))
    body: CommentOnAnswerBodySchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      answerId,
      authorId: userId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
