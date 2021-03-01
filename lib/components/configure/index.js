"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
exports.configure = function() {
  commander_1.default
    .option(
      "-s --spec <spec>",
      "URL or path to spec file (yml, or json is same)",
      "./spec.yaml"
    )
    .option("-p --port <port>", "Port for fake API", 3000)
    .option(
      "-i --image-provider <url>",
      "Provider for random image. URL includes width and height parameters",
      "https://picsum.photos/<width>/<height>/?random"
    )
    .parse(process.argv);
  return commander_1.default.opts();
};
//# sourceMappingURL=index.js.map
