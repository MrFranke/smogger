import { createMockGenerator } from '.';
import { OpenAPIV3 } from 'openapi-types';

const MOCKED_RESPONSE_OBJECT: OpenAPIV3.OperationObject = {
  summary: 'Test operation for response tests',
  operationId: 'test-op',
  tags: ['test'],
  responses: {
    '200': {
      description: 'Good response',
      content: {
        'application/json': {
          schema: {
            properties: {
              object: {
                type: 'object',
                required: ['id', 'name'],
                properties: {
                  id: {
                    type: 'integer',
                    format: 'int64',
                  },
                  name: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 30,
                  },
                  tag: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 10,
                  },
                },
              },
              array: {
                type: 'array',
                minItems: 1,
                maxItems: 3,
                items: {
                  type: 'string',
                },
              },
              string: {
                type: 'string',
                minLength: 10,
                maxLength: 20,
              },
              enum: {
                type: 'string',
                enum: ['asc', 'desc'],
              },
              nullable: {
                type: 'number',
                nullable: true,
              },
              date: {
                type: 'string',
                format: 'date',
              },
              image: {
                type: 'string',
                format: 'image',
              },
              big_image: {
                type: 'string',
                format: 'image[1200x800]',
              },
              number: {
                type: 'number',
              },
              integer: {
                type: 'integer',
                minimum: 10,
                maximum: 12,
              },
              boolean: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
    default: {
      description: 'unexpected error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: {
                type: 'integer',
                format: 'int32',
              },
              message: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
const generator = createMockGenerator({
  imageProvider:
    'http://testProvider.com?width=<width>&height=<height>',
});

const response = generator(MOCKED_RESPONSE_OBJECT);

test('Create generator with provider', () => {
  expect(typeof generator).toBe('function');
});

test('Create response', () => {
  expect(Array.isArray(response.array)).toBeTruthy();
});

test('minItems/maxItems', () => {
  expect(response.array.length).toBeGreaterThanOrEqual(1);
  expect(response.array.length).toBeLessThanOrEqual(3);
});

test('Created object signature is correct', () => {
  expect(typeof response.object.id).toBe('number');
  expect(typeof response.object.name).toBe('string');
  expect(typeof response.object.tag).toBe('string');
});

test('enum', () => {
  expect(
    response.enum === 'asc' || response.enum === 'desc',
  ).toBeTruthy();
});

test('nullable', () => {
  // Write test after split mocker into submodules
});

test('date', () => {
  expect(new Date(response.date)).not.toEqual('Invalid Date');
});

test('image', () => {
  expect(
    response.image.includes('http://testProvider.com'),
  ).toBeTruthy();
});

test('image with size', () => {
  expect(response.big_image).toContain('1200');
  expect(response.big_image).toContain('800');
});

test('string', () => {
  expect(response.string).toStrictEqual(expect.any(String));
});

test('minLength/maxLength', () => {
  expect(response.string.length).toBeGreaterThanOrEqual(10);
  expect(response.string.length).toBeLessThanOrEqual(30);
});

test('number', () => {
  expect(typeof response.number).toBe('number');
  expect(typeof response.integer).toBe('number');
});

test('minimum/maximum', () => {
  expect(
    response.integer >= 10 && response.integer <= 13,
  ).toBeTruthy();
});

test('boolean', () => {
  expect(typeof response.boolean).toBe('boolean');
});
