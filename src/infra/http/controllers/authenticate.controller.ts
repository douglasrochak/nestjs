import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases';

const AuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({ email, password });

    if (result.isLeft()) throw new Error();

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
