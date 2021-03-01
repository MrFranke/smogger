"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var combiners_1 = require("./combiners");
exports.getMethodModel = function(spec) {
  return function(path, method) {
    if (!spec.paths[path]) {
      throw new Error("Path " + path + " not found in spec");
    }
    if (!spec.paths[path][method]) {
      throw new Error("Path " + path + " not found in spec");
    }
    return spec.paths[path][method];
  };
};
exports.getResponseModel = function(method, status, contentType) {
  if (status === void 0) {
    status = 200;
  }
  if (contentType === void 0) {
    contentType = "application/json";
  }
  try {
    return method.responses[status].content[contentType].schema;
  } catch (e) {
    throw new Error("Response for status " + status + " not found");
  }
};
// @ts-ignore
exports.processor = function(cb, mutators, schema) {
  // @ts-ignore
  var next = exports.processor.bind(null, cb, mutators);
  if (schema.properties) {
    return utils_1.entries(schema.properties).reduce(function(result, _a) {
      var key = _a[0],
        property = _a[1];
      // @ts-ignore
      result[key] = next(property);
      return result;
    }, {});
  }
  if (schema.items) {
    if (mutators.items) {
      // @ts-ignore
      return mutators.items(schema).map(function(item) {
        return next(item);
      });
    }
    return next(schema.items);
  }
  if ("oneOf" in schema || "anyOf" in schema || "allOf" in schema) {
    var combiner = function() {
      return schema;
    };
    if ("oneOf" in schema) {
      combiner = combiners_1.oneOf(schema.oneOf);
    }
    if (schema.anyOf) {
      combiner = combiners_1.anyOf(schema.anyOf);
    }
    if (schema.allOf) {
      combiner = combiners_1.allOf(schema.allOf);
    }
    return next(combiner());
  }
  return cb(schema);
};
//# sourceMappingURL=index.js.map
