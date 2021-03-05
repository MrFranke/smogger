import Router from 'koa-router';
import {
  normalizer,
  entries,
  run,
  spreadToArgs,
  formatRouterPath,
} from '../utils';
import { Context } from 'koa';
import { NextFunction } from 'connect';
import { OpenAPIV3 } from 'openapi-types';

const log = ([path, methods]: [string, string]) => {
  console.log(`Create path ${path}`);
  console.log(`With methods`);
  Object.keys(methods).forEach(method => {
    console.log(`– ${method}`);
  });
  console.log('');
  return [path, methods];
};

const setRouteName = (operationId: string) => operationId || null;

const echoResponseHandler = (ctx: Context, next: NextFunction) => {
  ctx.body = `params: ${JSON.stringify(ctx.params, null, 2)}`;
  next();
};

const getRouterMethod = (router: Router) => (type: string) => {
  switch (type) {
    case 'get':
      return router.get;
    case 'post':
      return router.post;
    case 'delete':
      return router.delete;
    case 'put':
      return router.put;
    case 'update':
      return router.post;
    default:
      throw new Error('Unknown method');
  }
};

const createMethod = (
  router: Router, // save router
) => (
  path: string, // save path
) => (
  type: string,
  { operationId }: { operationId: string }, // bind method to router with saved path
) =>
  // @ts-ignore
  getRouterMethod(router)(type).bind(
    router,
    setRouteName(operationId),
    path,
    echoResponseHandler,
  );

export const createRouter = (paths: OpenAPIV3.PathsObject) => {
  const router = new Router();
  const createMethodWithRouter = createMethod(router);

  entries(paths)
    .map(log)
    .map(([path, methods]) => [formatRouterPath(path), methods]) // /path/{param} => /path/:param
    .map(([path, methods]) => [
      createMethodWithRouter(path),
      entries(methods),
    ]) // Создаем функцию для привязки метода к пути и получаем [methodName, methodParams]
    .reduce(
      normalizer(
        ([bindMethodToRouter, methods]: [any, string[]]) =>
          methods.map(spreadToArgs(bindMethodToRouter)), // bindMethodToRouter <- methodProps, возвращаем функцию привязки метода со всеми пропсами
      ),
      [],
    )
    .forEach(run); // Привязываем каждый метод к роутеру

  return router;
};
