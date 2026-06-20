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

for (const token of tokens) {
  if (token.type === "EOF") break;
  console.log(`${token.type} : ${token.value}`);
}

const parser = new Parser(tokens);
const program = parser.parse();

console.log(JSON.stringify(program, null, 2));

const interpreter = new Interpreter();
interpreter.interpret(program);