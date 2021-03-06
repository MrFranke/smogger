"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromCache = exports.setToCache = void 0;
var responseCache = new Map();
var cacheKey = function (path, method) { return method + "_" + path; };
var setToCache = function (path, method, data) {
    return responseCache.set(cacheKey(path, method), data);
};
exports.setToCache = setToCache;
var getFromCache = function (path, method) {
    return responseCache.get(cacheKey(path, method));
};
exports.getFromCache = getFromCache;
//# sourceMappingURL=index.js.map