import { Module } from '@nestjs/common';
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller';
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchRecentQuestionController } from '@/infra/http/controllers/fetch-recent-questions.controller';
import { DatabaseModule } from '../database/database.module';
import {
  AnswerQuestionUseCase,
  AuthenticateStudentUseCase,
  ChooseQuestionBestAnswerUseCase,
  CommentOnAnswerUseCase,
  CommentOnQuestionUseCase,
  CreateQuestionUseCase,
  DeleteAnswerCommentUseCase,
  DeleteAnswerUseCase,
  DeleteQuestionCommentUseCase,
  DeleteQuestionUseCase,
  EditAnswerUseCase,
  EditQuestionUseCase,
  FetchAnswerCommentsUseCase,
  FetchQuestionAnswersUseCase,
  FetchQuestionCommentsUseCase,
  FetchRecentQuestionsUseCase,
  GetQuestionBySlugUseCase,
  RegisterStudentUseCase,
} from '@/domain/forum/application/use-cases';

import { CryptoModule } from '../crypto/crypto.module';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer';
import { CommentOnQuestionController } from './controllers/comment-on-question.controller';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller';
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller';
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller';
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller';
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller';

@Module({
  imports: [DatabaseModule, CryptoModule],
  controllers: [
    CreateQuestionController,
    CreateAccountController,
    AuthenticateController,
    FetchRecentQuestionController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
  ],
})
export class HttpModule {}
