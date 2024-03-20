import {
  Body,
  Controller,
  Post,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common';

import { z } from 'zod';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

const AuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Wrong user credentials');

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Wrong user credentials ');

    const token = this.jwt.sign({
      sub: user.id,
    });

    return { access_token: token };
  }
}
