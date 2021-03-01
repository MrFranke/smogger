"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = __importDefault(require("faker"));
exports.entries = Object.entries.bind(Object);
exports.run = function(fn) {
  return fn();
};
exports.normalizer = function(handler) {
  return function(acc, arr) {
    return acc.concat(handler(arr));
  };
};
// @ts-ignore
exports.spreadToArgs = function(cb) {
  return function(props) {
    return cb.apply(void 0, props);
  };
};
exports.normalizeUrlParams = function(subst, brackets) {
  if (brackets === void 0) {
    brackets = ":$1";
  }
  return function(path) {
    return path.replace(subst, brackets);
  };
};
exports.formatSwaggerPath = exports.normalizeUrlParams(/:(\w+)/g, "{$1}");
exports.formatRouterPath = exports.normalizeUrlParams(/{(\w+)}/g, ":$1");
exports.objectPath = function(object, path) {
  // @ts-ignore
  return path.split(".").reduce(function(acc, part) {
    return acc[part];
  }, object);
};
exports.randomElement = function(arr) {
  return arr[faker_1.default.random.number({ min: 0, max: arr.length - 1 })];
};
exports.compose = function() {
  var fns = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    fns[_i] = arguments[_i];
  }
  // @ts-ignore
  return fns.reduce(function(f, g) {
    return function() {
      var xs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        xs[_i] = arguments[_i];
      }
      var r = g.apply(void 0, xs);
      return Array.isArray(r) ? f.apply(void 0, r) : f(r);
    };
  });
};
//# sourceMappingURL=utils.js.map
