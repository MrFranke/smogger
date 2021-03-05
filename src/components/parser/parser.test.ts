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

test('processor', () => {});
