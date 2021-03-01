import "source-map-support/register";

import SwaggerParser from "swagger-parser";
import * as Application from "koa";

import { createMockGenerator } from "./components/mocker";
import { createHTTPServer } from "./components/router";
import { getMethodModel } from "./components/parser";
import { compose } from "./components/utils";

type Config = {
  port: string,
  spec: string,
  imageProvider: string
};

type SmoggerFunction = (config: Config) => Promise<Application>;

export const Smogger: SmoggerFunction = async config => {
  const { spec: pathToSpec, port, imageProvider } = config;
  const spec = await SwaggerParser.dereference(pathToSpec);
  const mocker = createMockGenerator({ imageProvider });
  const getModelForMethod = getMethodModel(spec);
  const router = createHTTPServer({ port: Number(port) }, [
    compose(mocker, getModelForMethod)
  ]);

  return router(spec.paths);
};
