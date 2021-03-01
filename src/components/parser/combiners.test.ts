import { OpenAPIV3 } from 'openapi-types';
import { oneOf, anyOf, allOf } from './combiners';
let rndm = 0;

jest.mock('../utils', () => ({
  randomElement: (elements: any[]) => elements[rndm],
}));

beforeEach(() => {
  rndm = 0;
});

test('oneOf', () => {
  const getOneOfElement = oneOf([
    '#/components/schemas/1',
    '#/components/schemas/2',
    '#/components/schemas/3',
  ]);
  expect(getOneOfElement()).toBe('#/components/schemas/1');
  rndm = 1;
  expect(getOneOfElement()).toBe('#/components/schemas/1');
});

test('anyOf', () => {
  const getOneOfElement = anyOf([
    '#/components/schemas/1',
    '#/components/schemas/2',
    '#/components/schemas/3',
  ]);
  expect(getOneOfElement()).toBe('#/components/schemas/1');
  rndm = 1;
  expect(getOneOfElement()).toBe('#/components/schemas/2');
});

test('allOf', () => {
  const getOneOfElement = allOf([
    { one: 1 } as OpenAPIV3.SchemaObject,
    { two: 2 } as OpenAPIV3.SchemaObject,
    { three: 3 } as OpenAPIV3.SchemaObject,
  ]);

  expect(getOneOfElement()).toMatchObject({
    one: 1,
    two: 2,
    three: 3,
  });
});
