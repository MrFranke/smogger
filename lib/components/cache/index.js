"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var responseCache = new Map();
var cacheKey = function(path, method) {
  return method + "_" + path;
};
exports.setToCache = function(path, method, data) {
  return responseCache.set(cacheKey(path, method), data);
};
exports.getFromCache = function(path, method) {
  return responseCache.get(cacheKey(path, method));
};
//# sourceMappingURL=index.js.map
