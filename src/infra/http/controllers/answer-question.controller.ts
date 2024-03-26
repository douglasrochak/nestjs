import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases';

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller('/questions/:id/answers')
@UseGuards(JwtAuthGuard)
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(answerQuestionBodySchema))
    body: AnswerQuestionBodySchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const { content, attachmentsIds } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      questionId,
      instructorId: userId,
      content,
      attachmentsIds,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answer = result.value.answer;

    return { answer };
  }
}
