#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
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

async function repl(): Promise<void> {
  console.log("Zaban REPL — Urdu programming language");
  console.log('Likho "band" to exit.\n');

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "zaban> ",
  });

  let buffer = "";

  const runBuffer = (): void => {
    if (!buffer.trim()) return;
    try {
      printOutput(runSource(buffer));
    } catch (err) {
      if (err instanceof ZabanError) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
    buffer = "";
  };

  rl.prompt();

  rl.on("line", (line) => {
    if (line.trim() === "band") {
      rl.close();
      return;
    }

    buffer += (buffer ? "\n" : "") + line;
    const open = (buffer.match(/{/g) || []).length;
    const close = (buffer.match(/}/g) || []).length;
    if (open === close) {
      runBuffer();
    }
    rl.prompt();
  });
}

const [, , command, arg] = process.argv;

if (!command || command === "help" || command === "--help") {
  console.log(`Zaban — Urdu Programming Language

Usage:
  npm start run <file.zbn>   Run a Zaban program
  npm start repl             Interactive REPL
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
} else if (command === "repl") {
  await repl();
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
