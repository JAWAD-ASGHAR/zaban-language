import fs from "fs";
import { tokenize } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: npm run dev -- <file.zbn>");
  process.exit(1);
}

const source = fs.readFileSync(filePath, "utf8");

const tokens = tokenize(source);

const parser = new Parser(tokens);
const program = parser.parse();

const interpreter = new Interpreter();
interpreter.interpret(program);