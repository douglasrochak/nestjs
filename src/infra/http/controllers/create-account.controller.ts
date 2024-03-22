import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body;

    const result = await this.registerStudent.execute({
      email,
      name,
      password,
    });

    if (result.isLeft()) throw new Error();
  }
}
