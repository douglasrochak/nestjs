import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases';

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    body: EditAnswerBodySchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const { content, attachmentsIds } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      authorId: userId,
      answerId,
      content,
      attachmentsIds,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
