import { expect, test } from 'vitest';
import Slug from './slug';

test('Should be able to create a slug from a string', () => {
  const slug = Slug.createFromText('Example question títle');

  expect(slug.value).toEqual('example-question-title');
});
