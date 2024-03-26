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
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases';

@Controller('/questions/comments/:commentId')
@UseGuards(JwtAuthGuard)
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('commentId') questionCommentId: string,
    @CurrentUser()
    user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
