import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases';
import { QuestionPresenter } from '../presenters/question-presenter';

@Controller('/questions/:slug')
@UseGuards(JwtAuthGuard)
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const question = result.value.question;
    return {
      question: QuestionPresenter.toHTTP(question),
    };
  }
}
