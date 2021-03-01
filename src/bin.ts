#!/usr/bin/env node
import { configure } from "./components/configure";
import { Smogger } from ".";

Smogger(configure()).then(() => {
  console.log('Smogger started');
});
