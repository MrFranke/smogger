"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTTPServer = exports.createProcessingMiddleware = void 0;
var koa_1 = __importDefault(require("koa"));
var koa_compose_1 = __importDefault(require("koa-compose"));
var generate_1 = require("./generate");
var utils_1 = require("../utils");
var cache_1 = require("../cache");
var dataToResponse = function (data, ctx) { return (ctx.body = data); };
var exposeRequestProps = function (ctx) {
    var method = ctx.req.method, _matchedRoute = ctx._matchedRoute;
    var path = utils_1.formatSwaggerPath(_matchedRoute);
    return {
        path: path,
        method: method ? method.toLowerCase() : undefined,
    };
};
var createRouteMiddlewares = function (paths) {
    var router = generate_1.createRouter(paths);
    return [router.routes(), router.allowedMethods()];
};
var setRequestStateMiddleware = function (ctx, next) {
    if (!ctx.matched.length) {
        return next();
    }
    var _a = exposeRequestProps(ctx), path = _a.path, method = _a.method;
    ctx.state = __assign(__assign({}, ctx.state), { path: path,
        method: method });
    next();
};
var cacheMiddleware = function (ctx, next) {
    var _a = ctx.state, path = _a.path, method = _a.method;
    if (!path && !method) {
        return next();
    }
    var cachedData = cache_1.getFromCache(path, method);
    if (!cachedData) {
        return next();
    }
    dataToResponse(cachedData, ctx);
};
var createProcessingMiddleware = function (middlewares) { return function (ctx, next) {
    var _a = ctx.state, path = _a.path, method = _a.method;
    if (!path && !method) {
        return next();
    }
    var processor = utils_1.compose.apply(void 0, middlewares);
    var data = processor(path, method);
    var dataAsString = JSON.stringify(data);
    cache_1.setToCache(path, method, dataAsString);
    dataToResponse(dataAsString, ctx);
}; };
exports.createProcessingMiddleware = createProcessingMiddleware;
var createHTTPServer = function (_a, middlewares) {
    var port = _a.port;
    return function (paths) {
        var app = new koa_1.default();
        // @ts-ignore
        var serverMiddlewares = koa_compose_1.default(__spreadArray(__spreadArray([], createRouteMiddlewares(paths)), [
            setRequestStateMiddleware,
            cacheMiddleware,
            exports.createProcessingMiddleware(middlewares),
        ]));
        app.use(serverMiddlewares);
        app.listen(port);
        console.log("Mock server working on :" + port);
        return app;
    };
};
exports.createHTTPServer = createHTTPServer;
//# sourceMappingURL=index.js.map