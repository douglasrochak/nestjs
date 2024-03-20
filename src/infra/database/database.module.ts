import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
