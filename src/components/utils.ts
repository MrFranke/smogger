import faker from "faker";

export const entries: (obj: {}) => Array<[string, any]> = Object.entries.bind(
  Object
);
export const run: (fn: any) => void = fn => fn();

export const normalizer:
    (handler: any) => (acc:any[], arr:any[]) => any[]
    = handler => (acc, arr) => acc.concat(handler(arr));

// @ts-ignore
export const spreadToArgs = cb => props => cb(...props);

export const normalizeUrlParams = (
  subst: RegExp,
  brackets: string = ":$1"
) => (path: string) => path.replace(subst, brackets);

export const formatSwaggerPath: (path: string) => string = normalizeUrlParams(
  /:(\w+)/g,
  "{$1}"
);

export const formatRouterPath: (path: string) => string = normalizeUrlParams(
  /{(\w+)}/g,
  ":$1"
);

export const objectPath: (object: {}, path: string) => any = (object, path) =>
    // @ts-ignore
  path.split(".").reduce((acc, part) => acc[part], object);

export const randomElement: (arr: Array<any>) => any = arr =>
  arr[faker.random.number({min: 0, max: arr.length - 1})];

export const compose = (...fns: any) =>
    // @ts-ignore
  fns.reduce((f, g) => (...xs) => {
    const r = g(...xs);
    return Array.isArray(r) ? f(...r) : f(r);
  });
