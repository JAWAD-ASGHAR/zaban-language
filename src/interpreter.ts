import { tokenize } from "./lexer.js";
import { Parser, type Expr, type Program, type Stmt } from "./parser.js";
import { Environment } from "./runtime/Environment.js";
import { zabanError } from "./errors.js";

class BreakSignal extends Error {
  readonly kind = "break";
}

class ContinueSignal extends Error {
  readonly kind = "continue";
}

export class Interpreter {
  private output: string[] = [];
  private env = new Environment();

  constructor(private program: Program) {}

  run(): string[] {
    this.executeStatements(this.program.body);
    return this.output;
  }

  private executeStatements(stmts: Stmt[]): void {
    for (const stmt of stmts) {
      this.executeStatement(stmt);
    }
  }

  private executeStatement(stmt: Stmt): void {
    switch (stmt.type) {
      case "PrintStmt":
        this.executePrint(stmt);
        break;
      case "VarDecl":
        this.env.defineVar(stmt.name, this.evalExpr(stmt.value), 0, 0);
        break;
      case "ExprStmt":
        this.executeExprStmt(stmt);
        break;
      case "BlockStmt":
        this.executeBlock(stmt.body);
        break;
      case "IfStmt":
        this.executeIf(stmt);
        break;
      case "WhileStmt":
        this.executeWhile(stmt);
        break;
      case "BreakStmt":
        throw new BreakSignal();
      case "ContinueStmt":
        throw new ContinueSignal();
    }
  }

  private executeBlock(body: Stmt[]): void {
    const child = this.env.child();
    const prevEnv = this.env;
    this.env = child;
    try {
      this.executeStatements(body);
    } finally {
      this.env = prevEnv;
    }
  }

  private executePrint(stmt: { args: Expr[] }): void {
    if (stmt.args.length === 0) {
      zabanError("likho ke baad value chahiye", 0, 0);
    }
    for (const arg of stmt.args) {
      this.print(this.evalExpr(arg));
    }
  }

  private executeExprStmt(stmt: { expr: Expr }): void {
    if (stmt.expr.type === "AssignExpr") {
      this.executeAssign(stmt.expr);
      return;
    }
    this.evalExpr(stmt.expr);
  }

  private executeAssign(expr: Extract<Expr, { type: "AssignExpr" }>): void {
    const line = 0;
    const column = 0;
    const rhs = this.evalExpr(expr.value);
    let result: unknown;

    if (expr.operator === "=") {
      result = rhs;
    } else {
      const current = this.env.getVar(expr.name, line, column);
      result = this.binaryOp(expr.operator.slice(0, -1), current, rhs, line, column);
    }

    this.env.assignVar(expr.name, result, line, column);
  }

  private executeIf(stmt: Extract<Stmt, { type: "IfStmt" }>): void {
    if (this.isTruthy(this.evalExpr(stmt.condition))) {
      this.executeStatement(stmt.thenBranch);
      return;
    }
    if (stmt.elseBranch) {
      this.executeStatement(stmt.elseBranch);
    }
  }

  private executeWhile(stmt: Extract<Stmt, { type: "WhileStmt" }>): void {
    while (this.isTruthy(this.evalExpr(stmt.condition))) {
      try {
        this.executeStatement(stmt.body);
      } catch (e) {
        if (e instanceof BreakSignal) break;
        if (e instanceof ContinueSignal) continue;
        throw e;
      }
    }
  }

  private evalExpr(expr: Expr): unknown {
    switch (expr.type) {
      case "NumberLiteral":
        return expr.value;
      case "StringLiteral":
        return expr.value;
      case "BooleanLiteral":
        return expr.value;
      case "NullLiteral":
        return null;
      case "Identifier":
        return this.env.getVar(expr.name, 0, 0);
      case "UnaryExpr":
        return this.evalUnary(expr);
      case "BinaryExpr":
        return this.binaryOp(
          expr.operator,
          this.evalExpr(expr.left),
          this.evalExpr(expr.right),
          0,
          0
        );
      case "AssignExpr":
        this.executeAssign(expr);
        return this.env.getVar(expr.name, 0, 0);
    }
  }

  private evalUnary(expr: Extract<Expr, { type: "UnaryExpr" }>): number {
    if (expr.operator === "-") {
      const value = this.evalExpr(expr.right);
      if (typeof value !== "number") {
        zabanError("Unary minus sirf number par", 0, 0);
      }
      return -value;
    }
    zabanError(`Unknown unary operator: ${expr.operator}`, 0, 0);
  }

  private binaryOp(
    op: string,
    left: unknown,
    right: unknown,
    line: number,
    column: number
  ): unknown {
    switch (op) {
      case "+":
        if (typeof left === "string" || typeof right === "string") {
          return String(left) + String(right);
        }
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        zabanError("Invalid + operands", line, column);
      case "-":
        if (typeof left === "number" && typeof right === "number") {
          return left - right;
        }
        zabanError("Invalid - operands", line, column);
      case "*":
        if (typeof left === "number" && typeof right === "number") {
          return left * right;
        }
        zabanError("Invalid * operands", line, column);
      case "/":
        if (typeof left === "number" && typeof right === "number") {
          if (right === 0) {
            zabanError("Zero se divide nahi ho sakta", line, column);
          }
          return left / right;
        }
        zabanError("Invalid / operands", line, column);
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      case "<":
        if (typeof left === "number" && typeof right === "number") {
          return left < right;
        }
        zabanError("Invalid < operands", line, column);
      case ">":
        if (typeof left === "number" && typeof right === "number") {
          return left > right;
        }
        zabanError("Invalid > operands", line, column);
      case "<=":
        if (typeof left === "number" && typeof right === "number") {
          return left <= right;
        }
        zabanError("Invalid <= operands", line, column);
      case ">=":
        if (typeof left === "number" && typeof right === "number") {
          return left >= right;
        }
        zabanError("Invalid >= operands", line, column);
      default:
        zabanError(`Unknown operator: ${op}`, line, column);
    }
  }

  private isTruthy(value: unknown): boolean {
    if (value === null) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value.length > 0;
    return true;
  }

  private print(value: unknown): void {
    this.output.push(String(value));
  }
}

export function runSource(source: string): string[] {
  const tokens = tokenize(source);
  const parser = new Parser(tokens);
  const program = parser.parse();
  const interpreter = new Interpreter(program);
  return interpreter.run();
}
