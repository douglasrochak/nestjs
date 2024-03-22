import { MemoryStudentsRepo } from 'test/repositories/memory-student-repository';
import RegisterStudentUseCase from './register-student';
import { FakeHasher } from 'test/crypto/fake-hasher';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

describe('Register Student Use Case', () => {
  let studentRepo: MemoryStudentsRepo;
  let sut: RegisterStudentUseCase;
  let crypto: FakeHasher;

  beforeEach(() => {
    crypto = new FakeHasher();
    studentRepo = new MemoryStudentsRepo();
    sut = new RegisterStudentUseCase(studentRepo, crypto);
  });

  it('should be able to create a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value).toEqual({
      student: studentRepo.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const hashPassword = await crypto.hash('123456');

    expect(result.isRight()).toEqual(true);
    expect(studentRepo.items[0].password).toEqual(hashPassword);
  });

  it('should not be able to create a new student with same e-mail', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const result = await sut.execute({
      name: 'John Doe2',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
  });
});
