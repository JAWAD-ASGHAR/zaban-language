import { describe, it, expect } from "vitest";
import { tokenize } from "../src/lexer.js";
import { Parser } from "../src/parser.js";

function parse(source: string) {
  const tokens = tokenize(source);
  const parser = new Parser(tokens);
  return parser.parse();
}

describe("parser", () => {
  it("parses empty program", () => {
    const ast = parse(`
      shuru
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [],
    });
  });

  it("parses variable declaration", () => {
    const ast = parse(`
      shuru
        ye hai a = 3;
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VarDecl",
          name: "a",
          value: {
            type: "NumberLiteral",
            value: 3,
          },
        },
      ],
    });
  });

  it("parses print statement", () => {
    const ast = parse(`
      shuru
        likho "Salam Dunya";
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "PrintStmt",
          args: [
            {
              type: "StringLiteral",
              value: "Salam Dunya",
            },
          ],
        },
      ],
    });
  });

  it("parses binary expression with precedence", () => {
    const ast = parse(`
      shuru
        ye hai result = 3 + 4 * 5;
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VarDecl",
          name: "result",
          value: {
            type: "BinaryExpr",
            operator: "+",
            left: {
              type: "NumberLiteral",
              value: 3,
            },
            right: {
              type: "BinaryExpr",
              operator: "*",
              left: {
                type: "NumberLiteral",
                value: 4,
              },
              right: {
                type: "NumberLiteral",
                value: 5,
              },
            },
          },
        },
      ],
    });
  });

  it("parses assignment expression", () => {
    const ast = parse(`
      shuru
        b += 1;
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExprStmt",
          expr: {
            type: "AssignExpr",
            name: "b",
            operator: "+=",
            value: {
              type: "NumberLiteral",
              value: 1,
            },
          },
        },
      ],
    });
  });

  it("parses if statement", () => {
    const ast = parse(`
      shuru
        agar (a == b) {
          likho "same";
        }
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "IfStmt",
          condition: {
            type: "BinaryExpr",
            operator: "==",
            left: {
              type: "Identifier",
              name: "a",
            },
            right: {
              type: "Identifier",
              name: "b",
            },
          },
          thenBranch: {
            type: "BlockStmt",
            body: [
              {
                type: "PrintStmt",
                args: [
                  {
                    type: "StringLiteral",
                    value: "same",
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });

  it("parses if else-if statement", () => {
    const ast = parse(`
      shuru
        agar (b == a) {
          likho "b barabar a hai";
        } nahi to agar (b == 0) {
          likho "b sifar hai";
        }
      khatam
    `);

    expect(ast.type).toBe("Program");

    const ifStmt = ast.body[0];

    expect(ifStmt).toMatchObject({
      type: "IfStmt",
      elseBranch: {
        type: "IfStmt",
      },
    });
  });

  it("parses while loop", () => {
    const ast = parse(`
      shuru
        jab tak (b < 5) {
          likho b;
          b += 1;
        }
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "WhileStmt",
          condition: {
            type: "BinaryExpr",
            operator: "<",
            left: {
              type: "Identifier",
              name: "b",
            },
            right: {
              type: "NumberLiteral",
              value: 5,
            },
          },
          body: {
            type: "BlockStmt",
            body: [
              {
                type: "PrintStmt",
                args: [
                  {
                    type: "Identifier",
                    name: "b",
                  },
                ],
              },
              {
                type: "ExprStmt",
                expr: {
                  type: "AssignExpr",
                  name: "b",
                  operator: "+=",
                  value: {
                    type: "NumberLiteral",
                    value: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("parses program without shuru/khatam", () => {
    const ast = parse(`likho "hi"`);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "PrintStmt",
          args: [
            {
              type: "StringLiteral",
              value: "hi",
            },
          ],
        },
      ],
    });
  });

  it("throws if program does not end with khatam when shuru is present", () => {
    expect(() =>
      parse(`
        shuru
          likho "hi";
      `)
    ).toThrow(/khatam/);
  });

  it("parses print without semicolon", () => {
    const ast = parse(`
      shuru
        likho "hi"
      khatam
    `);

    expect(ast.body[0]).toMatchObject({
      type: "PrintStmt",
      args: [{ type: "StringLiteral", value: "hi" }],
    });
  });

  it("parses comma-separated likho args", () => {
    const ast = parse(`
      shuru
        likho "a", b
      khatam
    `);

    expect(ast.body[0]).toMatchObject({
      type: "PrintStmt",
      args: [
        { type: "StringLiteral", value: "a" },
        { type: "Identifier", name: "b" },
      ],
    });
  });

  it("parses multiple comma-separated print values", () => {
    const ast = parse(`
      shuru
        likho 1, 2, 3;
      khatam
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "PrintStmt",
          args: [
            { type: "NumberLiteral", value: 1 },
            { type: "NumberLiteral", value: 2 },
            { type: "NumberLiteral", value: 3 },
          ],
        },
      ],
    });
  });

  it("ignores code outside shuru and khatam boundaries", () => {
    const ast = parse(`
      this should be ignored
      shuru
        likho "hello";
      khatam
      and this should also be ignored
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "PrintStmt",
          args: [
            {
              type: "StringLiteral",
              value: "hello",
            },
          ],
        },
      ],
    });
  });

  it("parses unary minus number", () => {
    const ast = parse(`
    shuru
      ye hai x = -1;
    khatam
  `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VarDecl",
          name: "x",
          value: {
            type: "UnaryExpr",
            operator: "-",
            right: {
              type: "NumberLiteral",
              value: 1,
            },
          },
        },
      ],
    });
  });

  it("parses unary minus around expression", () => {
    const ast = parse(`
    shuru
      ye hai x = -(3 + 2);
    khatam
  `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VarDecl",
          name: "x",
          value: {
            type: "UnaryExpr",
            operator: "-",
            right: {
              type: "BinaryExpr",
              operator: "+",
              left: {
                type: "NumberLiteral",
                value: 3,
              },
              right: {
                type: "NumberLiteral",
                value: 2,
              },
            },
          },
        },
      ],
    });
  });

  it("parses bas break statement", () => {
    const ast = parse(`
    shuru
      jab tak (sach) {
        bas;
      }
    khatam
  `);

    expect(ast).toMatchObject({
      type: "Program",
      body: [
        {
          type: "WhileStmt",
          body: {
            type: "BlockStmt",
            body: [
              {
                type: "BreakStmt",
              },
            ],
          },
        },
      ],
    });
  });

  it("parses agla continue statement", () => {
    const ast = parse(`
    shuru
      jab tak (sach) {
        agla;
      }
    khatam
  `);

    expect(ast).toMatchObject({
      type: "Program",
      body: [
        {
          type: "WhileStmt",
          body: {
            type: "BlockStmt",
            body: [
              {
                type: "ContinueStmt",
              },
            ],
          },
        },
      ],
    });
  });
});
