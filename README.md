# Zaban — Urdu Programming Language

A learning build of a general-purpose programming language with Urdu keywords.

## Quick start

```bash
npm install
npm start -- examples/demo.zbn
npm start -- examples/salam.zbn
```

## How it works

A `.zbn` file goes through three steps:

1. **Lexer** (`lexer.ts`) — turns source text into tokens
2. **Parser** (`parser.ts`) — builds an AST from tokens
3. **Interpreter** (`interpreter.ts`) — walks the AST and runs the program

The interpreter keeps variables in memory while your program runs (e.g. `ye hai x = 10` stores `x`, `likho x` reads it back).

## Examples

| File | Demonstrates |
|---|---|
| `examples/salam.zbn` | Hello World |
| `examples/demo.zbn` | Variables, `jab tak`, `agar` / `nahi to agar` |
| `examples/big_demo.zbn` | Full demo with if/else-if/else |
| `examples/ghoomo.zbn` | `ghoomo` counted loop |

See [KEYWORDS.md](./KEYWORDS.md) for the Urdu ↔ English keyword reference.

## Project structure

```
src/
  lexer.ts       Tokenizer
  parser.ts      AST builder
  ast.ts         AST types
  interpreter.ts Executes programs
  index.ts       CLI entry point
examples/        Sample .zbn programs
```
