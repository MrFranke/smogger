"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = void 0;
var koa_router_1 = __importDefault(require("koa-router"));
var utils_1 = require("../utils");
var log = function (_a) {
    var path = _a[0], methods = _a[1];
    console.log("Create path " + path);
    console.log("With methods");
    Object.keys(methods).forEach(function (method) {
        console.log("\u2013 " + method);
    });
    console.log('');
    return [path, methods];
};
var setRouteName = function (operationId) { return operationId || null; };
var echoResponseHandler = function (ctx, next) {
    ctx.body = "params: " + JSON.stringify(ctx.params, null, 2);
    next();
};
var getRouterMethod = function (router) { return function (type) {
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
}; };
var createMethod = function (router) { return function (path) { return function (type, _a) {
    var operationId = _a.operationId;
    // @ts-ignore
    return getRouterMethod(router)(type).bind(router, setRouteName(operationId), path, echoResponseHandler);
}; }; };
var createRouter = function (paths) {
    var router = new koa_router_1.default();
    var createMethodWithRouter = createMethod(router);
    utils_1.entries(paths)
        .map(log)
        .map(function (_a) {
        var path = _a[0], methods = _a[1];
        return [utils_1.formatRouterPath(path), methods];
    }) // /path/{param} => /path/:param
        .map(function (_a) {
        var path = _a[0], methods = _a[1];
        return [
            createMethodWithRouter(path),
            utils_1.entries(methods),
        ];
    }) // Создаем функцию для привязки метода к пути и получаем [methodName, methodParams]
        .reduce(utils_1.normalizer(function (_a) {
        var bindMethodToRouter = _a[0], methods = _a[1];
        return methods.map(utils_1.spreadToArgs(bindMethodToRouter));
    }), [])
        .forEach(utils_1.run); // Привязываем каждый метод к роутеру
    return router;
};
exports.createRouter = createRouter;
//# sourceMappingURL=generate.js.map