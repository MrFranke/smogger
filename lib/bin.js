#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configure_1 = require("./components/configure");
var _1 = require(".");
_1.Smogger(configure_1.configure()).then(function() {
  console.log("Smogger started");
});
//# sourceMappingURL=bin.js.map
