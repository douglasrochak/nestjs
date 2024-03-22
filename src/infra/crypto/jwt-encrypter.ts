import { Encrypter } from '@/domain/forum/application/crypto/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, string>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
