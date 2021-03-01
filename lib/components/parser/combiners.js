"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var deepmerge_1 = __importDefault(require("deepmerge"));
exports.oneOf = function(combines) {
  var combiner = utils_1.randomElement(combines);
  return function() {
    return combiner;
  };
};
exports.anyOf = function(combines) {
  return function() {
    return utils_1.randomElement(combines);
  };
};
exports.allOf = function(combines) {
  return function() {
    return combines.reduce(function(acc, schema) {
      return deepmerge_1.default(acc, schema);
    });
  };
};
//# sourceMappingURL=combiners.js.map
