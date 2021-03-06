import { OpenAPIV3 } from 'openapi-types';
import { getMethodModel, getResponseModel, processor } from '.';
import SPEC from '../__mocks__/openapi.json';

test('getMethodModel: Create model extractor', () => {
  const extractor = getMethodModel(SPEC as OpenAPIV3.Document);
  expect(typeof extractor).toBe('function');
});

test('getMethodModel: Throw error when path is wrong', () => {
  const extractor = getMethodModel(SPEC as OpenAPIV3.Document);
  expect(() => extractor('/not/allowed/path', 'get')).toThrow(
    'Path /not/allowed/path not found in spec',
  );
});

test('getMethodModel: Get current method object', () => {
  const extractor = getMethodModel(SPEC as OpenAPIV3.Document);
  expect(extractor('/pets', 'get')).toBe(
    SPEC['paths']['/pets']['get'],
  );
});

test('getResponseModel: get current response', () => {
  const method = SPEC.paths['/pets'].get as OpenAPIV3.OperationObject;
  const response = getResponseModel(method);
  expect(response).toBe(
    SPEC.paths['/pets'].get.responses['200'].content[
      'application/json'
    ].schema,
  );
});

test('processor: create mock data from object schema', () => {
  const schema = SPEC.components.schemas.Pet;
  const mockFakeDataGenerator = (schema: OpenAPIV3.SchemaObject) =>
    schema.type;
  const result = processor(mockFakeDataGenerator, {}, schema);
  expect(result).toEqual({
    id: 'integer',
    name: 'string',
    tag: 'string',
  });
});

test('processor: create mock data from array schema', () => {
  const schema = SPEC.components.schemas.Pets;
  // @ts-ignore
  schema.items = SPEC.components.schemas.Pet;

  const mockFakeDataGenerator = (schema: OpenAPIV3.SchemaObject) =>
    schema.type;
  const mutators = {
    items: (schema: OpenAPIV3.ArraySchemaObject) => {
      console.log(schema);
      return new Array(3).fill(schema.items);
    },
  };

  const result = processor(mockFakeDataGenerator, mutators, schema);
  expect(result).toEqual([
    {
      id: 'integer',
      name: 'string',
      tag: 'string',
    },
    {
      id: 'integer',
      name: 'string',
      tag: 'string',
    },
    {
      id: 'integer',
      name: 'string',
      tag: 'string',
    },
  ]);
});
