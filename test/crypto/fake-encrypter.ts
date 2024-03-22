import { Encrypter } from '@/domain/forum/application/crypto/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, string>): Promise<string> {
    return JSON.stringify(payload);
  }
}
