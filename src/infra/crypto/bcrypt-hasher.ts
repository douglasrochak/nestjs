import { HashComparer } from '@/domain/forum/application/crypto/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/crypto/hash-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  hash(string: string): Promise<string> {
    return hash(string, this.HASH_SALT_LENGTH);
  }
  compare(string: string, hash: string): Promise<boolean> {
    return compare(string, hash);
  }
}
