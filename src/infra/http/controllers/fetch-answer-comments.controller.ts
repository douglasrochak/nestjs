import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases';
import { AnswerCommentPresenter } from '../presenters/answer-comment-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:id/comments')
@UseGuards(JwtAuthGuard)
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Param('id') answerId: string,
    @Query('p', queryValidationPipe) p: PageQueryParamSchema,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page: p,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answerComments = result.value.answerComments;

    return {
      answerComments: answerComments.map((comment) =>
        AnswerCommentPresenter.toHTTP(comment),
      ),
    };
  }
}
