import { Module } from '@nestjs/common';
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller';
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchRecentQuestionController } from '@/infra/http/controllers/fetch-recent-questions.controller';
import { DatabaseModule } from '../database/database.module';
import {
  AuthenticateStudentUseCase,
  CreateQuestionUseCase,
  EditQuestionUseCase,
  FetchRecentQuestionsUseCase,
  GetQuestionBySlugUseCase,
  RegisterStudentUseCase,
} from '@/domain/forum/application/use-cases';

import { CryptoModule } from '../crypto/crypto.module';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { EditQuestionController } from './controllers/edit-question.controller';

@Module({
  imports: [DatabaseModule, CryptoModule],
  controllers: [
    CreateQuestionController,
    CreateAccountController,
    AuthenticateController,
    FetchRecentQuestionController,
    GetQuestionBySlugController,
    EditQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
  ],
})
export class HttpModule {}
