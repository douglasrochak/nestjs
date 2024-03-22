export abstract class HashGenerator {
  abstract hash(string: string): Promise<string>;
}
