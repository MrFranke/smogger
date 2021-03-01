import { randomElement } from '../utils';
import deepmerge from 'deepmerge';
import { OpenAPIV3 } from 'openapi-types';

export type Combiner = (combines: Array<string>) => () => string;
type CombinerResolved = (
  combines: Array<OpenAPIV3.SchemaObject>,
) => () => OpenAPIV3.SchemaObject;

export const oneOf: Combiner = combines => {
  const combiner = randomElement(combines);
  return () => combiner;
};
export const anyOf: Combiner = combines => () =>
  randomElement(combines);
export const allOf: CombinerResolved = combines => () =>
  combines.reduce((acc, schema) =>
    deepmerge<OpenAPIV3.SchemaObject>(acc, schema),
  );
