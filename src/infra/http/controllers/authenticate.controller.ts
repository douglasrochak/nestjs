import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public.decorator';

const AuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
