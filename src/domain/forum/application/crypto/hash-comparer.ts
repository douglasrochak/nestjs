export abstract class HashComparer {
  abstract compare(string: string, hash: string): Promise<boolean>;
}
