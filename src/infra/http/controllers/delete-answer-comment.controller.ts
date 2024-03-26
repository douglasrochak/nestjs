import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases';

@Controller('/answers/comments/:commentId')
@UseGuards(JwtAuthGuard)
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('commentId') answerCommentId: string,
    @CurrentUser()
    user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
