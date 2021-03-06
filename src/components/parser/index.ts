import { entries } from '../utils';
import { allOf, anyOf, oneOf } from './combiners';
import { OpenAPIV3 } from 'openapi-types';

export type MutatorItems = (schema: OpenAPIV3.ArraySchemaObject) => any[];
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
type Operation = OpenAPIV3.OperationObject;

export const getMethodModel: (
  spec: OpenAPIV3.Document,
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
  
  if (spec.paths[path]?.[method] === undefined) {
    throw new Error(`Method ${method} not found in ${path}`);
  }
  
  return spec.paths[path]?.[method];
};

export const getResponseModel = (
  method: OpenAPIV3.OperationObject,
  status = '200',
  contentType = 'application/json',
) => {
  try {
    // @ts-ignore because method.responses?.[status] can be string ($ref), but not in this case
    return method.responses?.[status].content[contentType].schema;
  } catch (e) {
    throw new Error(`Response for status ${status} not found`);
  }
};

// @ts-ignore
export const processor = (cb, mutators: Mutators, schema) => {
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
