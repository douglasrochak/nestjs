import { MemoryStudentsRepo } from 'test/repositories/memory-student-repository';
import AuthenticateStudentUseCase from './authenticate-student';
import { FakeHasher } from 'test/crypto/fake-hasher';
import { FakeEncrypter } from 'test/crypto/fake-encrypter';
import { makeStudent } from 'test/factories/make-student';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

describe('Authenticate Student Use Case', () => {
  let studentRepo: MemoryStudentsRepo;
  let sut: AuthenticateStudentUseCase;
  let crypto: FakeHasher;
  let encrypter: FakeEncrypter;

  beforeEach(() => {
    crypto = new FakeHasher();
    encrypter = new FakeEncrypter();
    studentRepo = new MemoryStudentsRepo();
    sut = new AuthenticateStudentUseCase(studentRepo, crypto, encrypter);
  });

  it('should be able to authenticate an student', async () => {
    const EMAIL = 'student-01@example.com';
    const PASSWORD_HASH = await crypto.hash('123456');

    const student = makeStudent({
      email: EMAIL,
      password: PASSWORD_HASH,
    });

    await studentRepo.create(student);

    const result = await sut.execute({
      email: EMAIL,
      password: '123456',
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate an student with wrong credentials', async () => {
    const EMAIL = 'student-01@example.com';
    const WRONG_EMAIL = 'student-02@example.com';
    const PASSWORD_HASH = await crypto.hash('123456');

    const student = makeStudent({
      email: EMAIL,
      password: PASSWORD_HASH,
    });

    await studentRepo.create(student);

    const result = await sut.execute({
      email: WRONG_EMAIL,
      password: '123456',
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
