import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases';

@Controller('/answers/:answerId/choose-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser()
    user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      console.log(result.value);
      throw new BadRequestException();
    }
  }
}
