import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { tokenize } from "../src/lexer.js";

function types(source: string): string[] {
  return tokenize(source).map((t) => t.type);
}

function values(source: string): string[] {
  return tokenize(source).map((t) => t.value);
}

describe("lexer", () => {
  it("tokenizes numbers", () => {
    expect(tokenize("42")[0]).toMatchObject({ type: "NUMBER", value: "42" });
    expect(tokenize("3.14")[0]).toMatchObject({ type: "NUMBER", value: "3.14" });
  });

  it("tokenizes strings", () => {
    expect(tokenize('"salam"')[0]).toMatchObject({ type: "STRING", value: "salam" });
  });

  it("tokenizes keywords case-insensitively", () => {
    expect(tokenize("LIKHO")[0]).toMatchObject({ type: "KEYWORD", value: "likho" });
    expect(tokenize("Ye")[0]).toMatchObject({ type: "KEYWORD", value: "ye" });
  });

  it("maps true/false/null aliases to Urdu keywords", () => {
    expect(values("true false null")).toEqual(["sach", "jhoot", "khaali", ""]);
  });

  it("tokenizes identifiers", () => {
    expect(tokenize("count")[0]).toMatchObject({ type: "IDENTIFIER", value: "count" });
  });

  it("tokenizes operators", () => {
    expect(types("a += 1 == 2 != 3 <= 4 >= 5")).toEqual([
      "IDENTIFIER",
      "PLUSEQ",
      "NUMBER",
      "EQ",
      "NUMBER",
      "NEQ",
      "NUMBER",
      "LTE",
      "NUMBER",
      "GTE",
      "NUMBER",
      "EOF",
    ]);
  });

  it("tokenizes ye hai declaration", () => {
    expect(types("ye hai x = 10")).toEqual([
      "KEYWORD",
      "KEYWORD",
      "IDENTIFIER",
      "ASSIGN",
      "NUMBER",
      "EOF",
    ]);
  });

  it("skips line comments", () => {
    expect(types('likho "hi" // comment')).toEqual(["KEYWORD", "STRING", "EOF"]);
  });

  it("ends with EOF", () => {
    expect(tokenize("likho")[1]).toMatchObject({ type: "EOF" });
  });

  it("throws on unclosed strings", () => {
    expect(() => tokenize('"open')).toThrow(/String band nahi hui/);
  });

  it("tokenizes examples/salam.zbn", () => {
    const source = readFileSync(join(import.meta.dirname, "../examples/salam.zbn"), "utf8");
    const tokens = tokenize(source);
    expect(tokens.some((t) => t.type === "KEYWORD" && t.value === "shuru")).toBe(true);
    expect(tokens.some((t) => t.type === "KEYWORD" && t.value === "likho")).toBe(true);
    expect(tokens.some((t) => t.type === "STRING" && t.value === "Salam Dunya")).toBe(true);
    expect(tokens.at(-1)?.type).toBe("EOF");
  });
});
