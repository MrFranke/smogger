"use strict";
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var generate_1 = require("./generate");
var utils_1 = require("../utils");
var cache_1 = require("../cache");
var dataToResponse = function(data, ctx) {
  return (ctx.body = data);
};
var exposeRequestProps = function(ctx) {
  var method = ctx.req.method,
    _matchedRoute = ctx._matchedRoute;
  var path = utils_1.formatSwaggerPath(_matchedRoute);
  return {
    path: path,
    method: method
  };
};
exports.createRouteMiddleware = function(app, paths) {
  var router = generate_1.createRouter(paths);
  app.use(router.routes()).use(router.allowedMethods());
};
exports.createRequestStateMiddleware = function(app) {
  return app.use(function(ctx, next) {
    if (!ctx.matched.length) {
      return next();
    }
    var _a = exposeRequestProps(ctx),
      path = _a.path,
      method = _a.method;
    ctx.state = __assign({}, ctx.state, { path: path, method: method });
    next();
  });
};
exports.createCacheMiddleware = function(app) {
  return app.use(function(ctx, next) {
    var _a = ctx.state,
      path = _a.path,
      method = _a.method;
    if (!path && !method) {
      return next();
    }
    var cachedData = cache_1.getFromCache(path, method);
    if (!cachedData) {
      return next();
    }
    dataToResponse(cachedData, ctx);
  });
};
exports.createProcessingMiddleware = function(app, middlewares) {
  return app.use(function(ctx, next) {
    var _a = ctx.state,
      path = _a.path,
      method = _a.method;
    if (!path && !method) {
      return next();
    }
    var data = middlewares.reduce(function(result, mw) {
      return mw(path, method.toLowerCase(), result);
    }, {});
    //const data = processor(path, method.toLowerCase());
    var dataAsString = JSON.stringify(data);
    cache_1.setToCache(path, method, dataAsString);
    dataToResponse(dataAsString, ctx);
  });
};
exports.createHTTPServer = function(_a, middlewares) {
  var port = _a.port;
  return function(paths) {
    var app = new koa_1.default();
    exports.createRouteMiddleware(app, paths);
    exports.createRequestStateMiddleware(app);
    exports.createCacheMiddleware(app);
    exports.createProcessingMiddleware(app, middlewares);
    app.listen(port);
    console.log("Mock server working on :" + port);
    return app;
  };
};
//# sourceMappingURL=index.js.map
