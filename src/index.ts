#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runSource } from "./interpreter.js";
import { ZabanError } from "./errors.js";

function printOutput(lines: string[]): void {
  for (const line of lines) {
    console.log(line);
  }
}

function runFile(filePath: string): void {
  const source = readFileSync(filePath, "utf-8");
  try {
    printOutput(runSource(source));
  } catch (err) {
    if (err instanceof ZabanError) {
      console.error(err.message);
      process.exit(1);
    }
    throw err;
  }
}

const [, , command, arg] = process.argv;

if (!command || command === "help" || command === "--help") {
  console.log(`Zaban — Urdu Programming Language

Usage:
  npm start run <file.zbn>   Run a Zaban program
  npm test                   Run unit tests
`);
  process.exit(0);
}

if (command === "run") {
  if (!arg) {
    console.error("File path required: npm start run examples/demo.zbn");
    process.exit(1);
  }
  runFile(arg);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
