import { Either, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10);
  } else {
    return left('Error');
  }
}

test('Success result', () => {
  const result = doSomething(true);

  if (result.isRight()) console.log(result.value);

  if (result.isLeft()) console.log(result.value);

  expect(result.isRight()).toEqual(true);
  expect(result.isLeft()).toEqual(false);
});

test('Success result', () => {
  const result = doSomething(false);

  expect(result.isRight()).toEqual(false);
  expect(result.isLeft()).toEqual(true);
});
