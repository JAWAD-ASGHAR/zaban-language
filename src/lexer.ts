import { isKeyword } from "./keywords.js";
import { zabanError } from "./errors.js";

export type TokenType =
  | "NUMBER"
  | "STRING"
  | "IDENTIFIER"
  | "KEYWORD"
  | "SEMICOLON"
  | "LPAREN"
  | "RPAREN"
  | "LBRACE"
  | "RBRACE"
  | "COMMA"
  | "EQ"
  | "NEQ"
  | "LT"
  | "GT"
  | "LTE"
  | "GTE"
  | "ASSIGN"
  | "PLUS"
  | "MINUS"
  | "STAR"
  | "SLASH"
  | "PLUSEQ"
  | "MINUSEQ"
  | "STAREQ"
  | "SLASHEQ"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let line = 1;
  let column = 1;
  let i = 0;

  while (i < source.length) {
    const ch = source[i]!;

    if (ch === "\n") {
      line++;
      column = 1;
      i++;
      continue;
    }

    if (ch === " " || ch === "\t" || ch === "\r") {
      column++;
      i++;
      continue;
    }

    if (ch === "/" && source[i + 1] === "/") {
      while (i < source.length && source[i] !== "\n") {
        i++;
      }
      continue;
    }

    const startLine = line;
    const startCol = column;

    if (ch === ";") {
      tokens.push({ type: "SEMICOLON", value: ";", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }

    if (ch === "(") {
      tokens.push({ type: "LPAREN", value: "(", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }

    if (ch === ")") {
      tokens.push({ type: "RPAREN", value: ")", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }

    if (ch === "{") {
      tokens.push({ type: "LBRACE", value: "{", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }

    if (ch === "}") {
      tokens.push({ type: "RBRACE", value: "}", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }

    if (ch === ",") {
      tokens.push({ type: "COMMA", value: ",", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }

    if (ch === '"') {
      i++;
      column++;
      let value = "";
      while (i < source.length && source[i] !== '"') {
        if (source[i] === "\n") {
          zabanError("String band nahi hui", startLine, startCol);
        }
        value += source[i];
        i++;
        column++;
      }
      if (i >= source.length) {
        zabanError("String band nahi hui", startLine, startCol);
      }
      i++;
      column++;
      tokens.push({ type: "STRING", value, line: startLine, column: startCol });
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      let value = "";
      while (i < source.length && source[i] >= "0" && source[i] <= "9") {
        value += source[i];
        i++;
        column++;
      }
      if (source[i] === ".") {
        value += ".";
        i++;
        column++;
        while (i < source.length && source[i] >= "0" && source[i] <= "9") {
          value += source[i];
          i++;
          column++;
        }
      }
      tokens.push({ type: "NUMBER", value, line: startLine, column: startCol });
      continue;
    }

    if (
      (ch >= "a" && ch <= "z") ||
      (ch >= "A" && ch <= "Z") ||
      ch === "_"
    ) {
      let value = "";
      while (
        i < source.length &&
        ((source[i]! >= "a" && source[i]! <= "z") ||
          (source[i]! >= "A" && source[i]! <= "Z") ||
          (source[i]! >= "0" && source[i]! <= "9") ||
          source[i] === "_")
      ) {
        value += source[i];
        i++;
        column++;
      }
      const lower = value.toLowerCase();
      if (isKeyword(lower)) {
        tokens.push({ type: "KEYWORD", value: lower, line: startLine, column: startCol });
      } else if (lower === "true") {
        tokens.push({ type: "KEYWORD", value: "sach", line: startLine, column: startCol });
      } else if (lower === "false") {
        tokens.push({ type: "KEYWORD", value: "jhoot", line: startLine, column: startCol });
      } else if (lower === "null") {
        tokens.push({ type: "KEYWORD", value: "khaali", line: startLine, column: startCol });
      } else {
        tokens.push({ type: "IDENTIFIER", value, line: startLine, column: startCol });
      }
      continue;
    }

    if (ch === "=" && source[i + 1] === "=") {
      tokens.push({ type: "EQ", value: "==", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }
    if (ch === "!" && source[i + 1] === "=") {
      tokens.push({ type: "NEQ", value: "!=", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }
    if (ch === "<" && source[i + 1] === "=") {
      tokens.push({ type: "LTE", value: "<=", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }
    if (ch === ">" && source[i + 1] === "=") {
      tokens.push({ type: "GTE", value: ">=", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }
    if (ch === "+" && source[i + 1] === "=") {
      tokens.push({ type: "PLUSEQ", value: "+=", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }
    if (ch === "-" && source[i + 1] === "=") {
      tokens.push({ type: "MINUSEQ", value: "-=", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }
    if (ch === "*" && source[i + 1] === "=") {
      tokens.push({ type: "STAREQ", value: "*=", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }
    if (ch === "/" && source[i + 1] === "=") {
      tokens.push({ type: "SLASHEQ", value: "/=", line: startLine, column: startCol });
      i += 2;
      column += 2;
      continue;
    }

    if (ch === "=") {
      tokens.push({ type: "ASSIGN", value: "=", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }
    if (ch === "+") {
      tokens.push({ type: "PLUS", value: "+", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }
    if (ch === "-") {
      tokens.push({ type: "MINUS", value: "-", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }
    if (ch === "*") {
      tokens.push({ type: "STAR", value: "*", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }
    if (ch === "/") {
      tokens.push({ type: "SLASH", value: "/", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }
    if (ch === "<") {
      tokens.push({ type: "LT", value: "<", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }
    if (ch === ">") {
      tokens.push({ type: "GT", value: ">", line: startLine, column: startCol });
      i++;
      column++;
      continue;
    }

    zabanError(`Unknown character: ${ch}`, line, column);
  }

  tokens.push({ type: "EOF", value: "", line, column });
  return tokens;
}
