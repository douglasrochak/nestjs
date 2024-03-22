export abstract class Encrypter {
  abstract encrypt(payload: Record<string, string>): Promise<string>;
}
