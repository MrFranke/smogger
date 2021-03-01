import Koa, {Context} from "koa";
import koaCompose from "koa-compose";

import { createRouter } from "./generate";
import { compose, formatSwaggerPath } from "../utils";

import { getFromCache, setToCache } from "../cache";
import Application = require("koa");
import {OpenAPIV3} from "openapi-types";

type Middleware = (ctx: Context, next: any) => void;

export type ProcessingMiddleware = (
  path: string,
  method: string,
  data?: any
) => any;

const dataToResponse: (data: string, ctx: Context) => string = (data, ctx) =>
  (ctx.body = data);

type CreateProccesingMiddleware = (
  processors: Array<ProcessingMiddleware>
) => Middleware;

const exposeRequestProps = (ctx: Context) => {
  const {
    req: { method },
    _matchedRoute
  } = ctx;
  const path = formatSwaggerPath(_matchedRoute);

  return {
    path,
    method: method ? method.toLowerCase() : undefined
  };
};

const createRouteMiddlewares = (paths: OpenAPIV3.PathObject) => {
  const router = createRouter(paths);

  return [router.routes(), router.allowedMethods()];
};

const setRequestStateMiddleware: Middleware = (ctx, next) => {
  if (!ctx.matched.length) {
    return next();
  }

  const { path, method } = exposeRequestProps(ctx);

  ctx.state = {
    ...ctx.state,
    path,
    method
  };

  next();
};

const cacheMiddleware: Middleware = (ctx, next) => {
  const { path, method } = ctx.state;

  if (!path && !method) {
    return next();
  }

  const cachedData = getFromCache(path, method);

  if (!cachedData) {
    return next();
  }

  dataToResponse(cachedData, ctx);
};

export const createProcessingMiddleware: CreateProccesingMiddleware = (
  middlewares: ProcessingMiddleware[]
) => (ctx, next) => {
  const { path, method } = ctx.state;

  if (!path && !method) {
    return next();
  }

  const processor = compose(...middlewares);
  const data = processor(path, method);

  const dataAsString = JSON.stringify(data);

  setToCache(path, method, dataAsString);
  dataToResponse(dataAsString, ctx);
};

export const createHTTPServer = (
  { port }: { port: number },
  middlewares: ProcessingMiddleware[]
) => (paths: OpenAPIV3.PathObject): Application => {
  const app = new Koa();

  const serverMiddlewares = koaCompose([
    ...createRouteMiddlewares(paths),
    setRequestStateMiddleware,
    cacheMiddleware,
    createProcessingMiddleware(middlewares)
  ]);

  app.use(serverMiddlewares);
  app.listen(port);

  console.log(`Mock server working on :${port}`);
  return app;
};
