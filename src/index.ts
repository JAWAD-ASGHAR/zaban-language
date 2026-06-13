import { tokenize } from "./lexer.js";

const source = process.argv[2];
const tokens = tokenize(source);

for (const token of tokens) {
  if (token.type === "EOF") break;
  console.log(`${token.type} : ${token.value}`);
}
