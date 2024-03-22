import { HashComparer } from '@/domain/forum/application/crypto/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/crypto/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(string: string): Promise<string> {
    return string.concat('-hash');
  }
  async compare(string: string, hash: string): Promise<boolean> {
    return string.concat('-hash') === hash;
  }
}
