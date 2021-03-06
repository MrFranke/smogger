"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = exports.getResponseModel = exports.getMethodModel = void 0;
var utils_1 = require("../utils");
var combiners_1 = require("./combiners");
var getMethodModel = function (spec) { return function (path, method) {
    var _a, _b;
    if (spec.paths === undefined) {
        throw new Error("Path " + path + " not found in spec");
    }
    if (spec.paths[path] === undefined) {
        throw new Error("Path " + path + " not found in spec");
    }
    if (((_a = spec.paths[path]) === null || _a === void 0 ? void 0 : _a[method]) === undefined) {
        throw new Error("Method " + method + " not found in " + path);
    }
    return (_b = spec.paths[path]) === null || _b === void 0 ? void 0 : _b[method];
}; };
exports.getMethodModel = getMethodModel;
var getResponseModel = function (method, status, contentType) {
    var _a;
    if (status === void 0) { status = '200'; }
    if (contentType === void 0) { contentType = 'application/json'; }
    try {
        // @ts-ignore because method.responses?.[status] can be string ($ref), but not in this case
        return (_a = method.responses) === null || _a === void 0 ? void 0 : _a[status].content[contentType].schema;
    }
    catch (e) {
        throw new Error("Response for status " + status + " not found");
    }
};
exports.getResponseModel = getResponseModel;
// @ts-ignore
var processor = function (cb, mutators, schema) {
    // @ts-ignore
    var next = exports.processor.bind(null, cb, mutators);
    if (schema.properties) {
        return utils_1.entries(schema.properties).reduce(function (result, _a) {
            var key = _a[0], property = _a[1];
            // @ts-ignore
            result[key] = next(property);
            return result;
        }, {});
    }
    if (schema.items) {
        if (mutators.items) {
            return mutators.items(schema).map(function (item) { return next(item); });
        }
        return next(schema.items);
    }
    if ('oneOf' in schema || 'anyOf' in schema || 'allOf' in schema) {
        var combiner = function () { return schema; };
        if ('oneOf' in schema) {
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
exports.processor = processor;
//# sourceMappingURL=index.js.map