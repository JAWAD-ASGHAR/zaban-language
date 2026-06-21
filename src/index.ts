#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runSource } from "./interpreter.js";
import { ZabanError } from "./errors.js";

const [, , arg1, arg2] = process.argv;
const filePath = arg1 === "run" ? arg2 : arg1;

if (!filePath) {
  console.error("Usage: npm start -- examples/demo.zbn");
  console.error("   or: npm start run examples/demo.zbn");
  process.exit(1);
}

try {
  const source = readFileSync(filePath, "utf-8");
  for (const line of runSource(source)) {
    console.log(line);
  }
} catch (err) {
  if (err instanceof ZabanError) {
    console.error(err.message);
    process.exit(1);
  }
  throw err;
}
