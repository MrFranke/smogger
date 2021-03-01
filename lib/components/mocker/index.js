"use strict";
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = __importDefault(require("faker"));
var utils_1 = require("../utils");
var parser_1 = require("../parser");
var getFakerMethod = function(path) {
  return utils_1.objectPath(faker_1.default, path);
};
var createEnum = function(enumElements) {
  return utils_1.randomElement(enumElements);
};
var createDate = function() {
  return faker_1.default.date.between(
    new Date("2015-01-01"),
    new Date("2021-01-01")
  );
};
var createBoolean = function() {
  return faker_1.default.random.boolean();
};
var createImageLink = function(provider, width, height) {
  if (width === void 0) {
    width = 200;
  }
  if (height === void 0) {
    height = 300;
  }
  return provider
    .replace("<width>", String(width))
    .replace("<height>", String(height));
};
var createNumber = function(min, max) {
  if (min === void 0) {
    min = 0;
  }
  if (max === void 0) {
    max = 9999999;
  }
  var options = { min: min, max: max };
  return faker_1.default.random.number(options);
};
var createString = function(format) {
  if (format === void 0) {
    format = "random.words";
  }
  return function(min, max) {
    var wordsCount = faker_1.default.random.number({ min: min, max: max });
    var fakerMethod = getFakerMethod(format);
    var words = fakerMethod(wordsCount);
    return words.slice(0, max);
  };
};
var isNumber = function(type) {
  return type === "number" || type === "integer";
};
var extractImageSize = function(format) {
  return format
    .replace(/^image\[(\d+x\d+)\]/g, "$1")
    .split("x")
    .map(Number);
};
var createFakeData = function(_a) {
  var imageProvider = _a.imageProvider;
  return function(_a) {
    var _b = _a.type,
      type = _b === void 0 ? "string" : _b,
      _c = _a.format,
      format = _c === void 0 ? "random.words" : _c,
      _d = _a.minimum,
      minimum = _d === void 0 ? 0 : _d,
      _e = _a.maximum,
      maximum = _e === void 0 ? 99999999 : _e,
      _f = _a.minLength,
      minLength = _f === void 0 ? 0 : _f,
      _g = _a.maxLength,
      maxLength = _g === void 0 ? 500 : _g,
      rest = __rest(_a, [
        "type",
        "format",
        "minimum",
        "maximum",
        "minLength",
        "maxLength"
      ]);
    if (rest.enum) {
      return createEnum(rest.enum);
    }
    if ("nullable" in rest && faker_1.default.random.boolean()) {
      return null;
    }
    if (format === "date") {
      return createDate();
    }
    if (/^image\[\d+x\d+\]/.test(format)) {
      var _h = extractImageSize(format),
        width = _h[0],
        height = _h[1];
      return createImageLink(imageProvider, width, height);
    }
    if (/^image/.test(format)) {
      return createImageLink(imageProvider);
    }
    if (type === "string") {
      return createString(format)(minLength, maxLength);
    }
    if (isNumber(type)) {
      return createNumber(minimum, maximum);
    }
    if (type === "boolean") {
      return createBoolean();
    }
  };
};
var generateArrayItems = function(_a) {
  var _b = _a.minItems,
    minItems = _b === void 0 ? 0 : _b,
    _c = _a.maxItems,
    maxItems = _c === void 0 ? 15 : _c,
    items = _a.items;
  var arrayLength = faker_1.default.random.number({
    min: minItems,
    max: maxItems
  });
  return new Array(arrayLength).fill(items);
};
exports.createMockGenerator = function(_a) {
  var imageProvider = _a.imageProvider;
  return function(model) {
    return parser_1.processor(
      // @ts-ignore
      createFakeData({ imageProvider: imageProvider }),
      { items: generateArrayItems },
      // @ts-ignore
      parser_1.getResponseModel(model)
    );
  };
};
//# sourceMappingURL=index.js.map
