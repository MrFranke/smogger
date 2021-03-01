import { entries } from '../utils';
import { allOf, anyOf, oneOf } from './combiners';
import { OpenAPIV3, IJsonSchema } from 'openapi-types';

export type MutatorItems = (schema: IJsonSchema) => Array<any>;
export type Mutators = {
  items?: MutatorItems;
};

type AllowHTTPMethod =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'patch'
  | 'head'
  | 'trace';
type Document = OpenAPIV3.Document;
type Operation = OpenAPIV3.OperationObject;

export const getMethodModel: (
  spec: Document,
) => (
  path: string,
  method: AllowHTTPMethod,
) => Operation | undefined = spec => (path, method) => {
  if (spec.paths === undefined) {
    throw new Error(`Path ${path} not found in spec`);
  }
  if (spec.paths[path] === undefined) {
    throw new Error(`Path ${path} not found in spec`);
  }
  // @ts-ignore
  if (spec.paths[path][method] === undefined) {
    throw new Error(`Method ${method} not found in ${path}`);
  }
  // @ts-ignore
  return spec.paths[path][method];
};

export const getResponseModel = (
  method: any,
  status = 200,
  contentType = 'application/json',
) => {
  try {
    return method.responses[status].content[contentType].schema;
  } catch (e) {
    throw new Error(`Response for status ${status} not found`);
  }
};

// @ts-ignore
export const processor = (cb, mutators, schema) => {
  // @ts-ignore
  const next = processor.bind(null, cb, mutators);

  if (schema.properties) {
    return entries(schema.properties).reduce(
      (result, [key, property]) => {
        // @ts-ignore
        result[key] = next(property);
        return result;
      },
      {},
    );
  }

  if (schema.items) {
    if (mutators.items) {
      // @ts-ignore
      return mutators.items(schema).map(item => next(item));
    }
    return next(schema.items);
  }

  if ('oneOf' in schema || 'anyOf' in schema || 'allOf' in schema) {
    let combiner = () => schema;
    if ('oneOf' in schema) {
      combiner = oneOf(schema.oneOf);
    }
    if (schema.anyOf) {
      combiner = anyOf(schema.anyOf);
    }
    if (schema.allOf) {
      combiner = allOf(schema.allOf);
    }

    return next(combiner());
  }

  return cb(schema);
};
