import type { ProgramNode, StatementNode, ExprNode } from "./ast.js";
import { tokenize } from "./lexer.js";
import { Parser } from "./parser.js";
import { zabanError } from "./errors.js";

type ZabanValue = string | number | boolean | null;

class Environment {
  private vars = new Map<string, ZabanValue>();

  constructor(private parent?: Environment) {}

  defineVar(name: string, value: ZabanValue, line: number, column: number): void {
    if (this.vars.has(name)) {
      zabanError(`Variable '${name}' pehle se mojood hai`, line, column);
    }
    this.vars.set(name, value);
  }

  assignVar(name: string, value: ZabanValue, line: number, column: number): void {
    if (this.vars.has(name)) {
      this.vars.set(name, value);
      return;
    }
    if (this.parent) {
      this.parent.assignVar(name, value, line, column);
      return;
    }
    zabanError(`Variable '${name}' mojood nahi`, line, column);
  }

  getVar(name: string, line: number, column: number): ZabanValue {
    if (this.vars.has(name)) {
      return this.vars.get(name)!;
    }
    if (this.parent) {
      return this.parent.getVar(name, line, column);
    }
    zabanError(`Variable '${name}' mojood nahi`, line, column);
  }

  child(): Environment {
    return new Environment(this);
  }
}

class BreakSignal extends Error {
  readonly kind = "break" as const;
}
class ContinueSignal extends Error {
  readonly kind = "continue" as const;
}

export class Interpreter {
  private output: string[] = [];
  private env = new Environment();

  constructor(private program: ProgramNode) {}

  run(): string[] {
    this.executeStatements(this.program.body);
    return this.output;
  }

  private executeStatements(stmts: StatementNode[]): void {
    for (const stmt of stmts) {
      try {
        this.executeStatement(stmt);
      } catch (e) {
        if (e instanceof BreakSignal || e instanceof ContinueSignal) {
          throw e;
        }
        throw e;
      }
    }
  }

  private executeStatement(stmt: StatementNode): void {
    switch (stmt.type) {
      case "Print":
        this.executePrint(stmt);
        break;
      case "VarDecl":
        this.env.defineVar(stmt.name, this.evalExpr(stmt.init), stmt.line, stmt.column);
        break;
      case "Assign":
        this.executeAssign(stmt);
        break;
      case "BlockStmt":
        this.executeBlockStmt(stmt.body);
        break;
      case "If":
        this.executeIf(stmt);
        break;
      case "While":
        this.executeWhile(stmt);
        break;
      case "CountLoop":
        this.executeCountLoop(stmt);
        break;
      case "Break":
        throw new BreakSignal();
      case "Continue":
        throw new ContinueSignal();
    }
  }

  private executeBlockStmt(body: StatementNode[]): void {
    const child = this.env.child();
    const prevEnv = this.env;
    this.env = child;
    try {
      this.executeStatements(body);
    } catch (e) {
      if (e instanceof BreakSignal || e instanceof ContinueSignal) {
        throw e;
      }
      throw e;
    } finally {
      this.env = prevEnv;
    }
  }

  private executePrint(stmt: Extract<StatementNode, { type: "Print" }>): void {
    if (stmt.args.length === 0) {
      zabanError("likho ke baad value chahiye", stmt.line, stmt.column);
    }
    for (const arg of stmt.args) {
      this.print(this.evalExpr(arg));
    }
  }

  private executeAssign(stmt: Extract<StatementNode, { type: "Assign" }>): void {
    const current = this.env.getVar(stmt.name, stmt.line, stmt.column);
    const rhs = this.evalExpr(stmt.value);
    let result: ZabanValue;
    switch (stmt.operator) {
      case "=":
        result = rhs;
        break;
      case "+=":
        result = this.binaryOp("+", current, rhs, stmt.line, stmt.column);
        break;
      case "-=":
        result = this.binaryOp("-", current, rhs, stmt.line, stmt.column);
        break;
      case "*=":
        result = this.binaryOp("*", current, rhs, stmt.line, stmt.column);
        break;
      case "/=":
        result = this.binaryOp("/", current, rhs, stmt.line, stmt.column);
        break;
    }
    this.env.assignVar(stmt.name, result, stmt.line, stmt.column);
  }

  private executeIf(stmt: Extract<StatementNode, { type: "If" }>): void {
    for (const branch of stmt.branches) {
      if (this.isTruthy(this.evalExpr(branch.condition))) {
        this.executeBlockStmt(branch.body);
        return;
      }
    }
    if (stmt.elseBody) {
      this.executeBlockStmt(stmt.elseBody);
    }
  }

  private executeWhile(stmt: Extract<StatementNode, { type: "While" }>): void {
    while (this.isTruthy(this.evalExpr(stmt.condition))) {
      try {
        this.executeBlockStmt(stmt.body);
      } catch (e) {
        if (e instanceof BreakSignal) break;
        if (e instanceof ContinueSignal) continue;
        throw e;
      }
    }
  }

  private executeCountLoop(stmt: Extract<StatementNode, { type: "CountLoop" }>): void {
    for (let i = 0; i < stmt.count; i++) {
      try {
        this.executeBlockStmt(stmt.body);
      } catch (e) {
        if (e instanceof BreakSignal) break;
        if (e instanceof ContinueSignal) continue;
        throw e;
      }
    }
  }

  private evalExpr(expr: ExprNode): ZabanValue {
    switch (expr.type) {
      case "Literal":
        return expr.value;
      case "Identifier":
        return this.env.getVar(expr.name, expr.line, expr.column);
      case "BinaryExpr":
        return this.binaryOp(
          expr.operator,
          this.evalExpr(expr.left),
          this.evalExpr(expr.right),
          expr.line,
          expr.column,
        );
      case "UnaryExpr":
        return this.evalUnary(expr);
    }
  }

  private evalUnary(expr: Extract<ExprNode, { type: "UnaryExpr" }>): ZabanValue {
    if (expr.operator === "-") {
      const v = this.evalExpr(expr.operand);
      if (typeof v !== "number") {
        zabanError("Unary minus sirf number par", expr.line, expr.column);
      }
      return -v;
    }
    zabanError(`Unknown unary operator: ${expr.operator}`, expr.line, expr.column);
  }

  private binaryOp(
    op: string,
    left: ZabanValue,
    right: ZabanValue,
    line: number,
    column: number,
  ): ZabanValue {
    switch (op) {
      case "+":
        if (typeof left === "string" || typeof right === "string") {
          return String(left) + String(right);
        }
        if (typeof left === "number" && typeof right === "number") return left + right;
        zabanError("Invalid + operands", line, column);
      case "-":
        if (typeof left === "number" && typeof right === "number") return left - right;
        zabanError("Invalid - operands", line, column);
      case "*":
        if (typeof left === "number" && typeof right === "number") return left * right;
        zabanError("Invalid * operands", line, column);
      case "/":
        if (typeof left === "number" && typeof right === "number") {
          if (right === 0) zabanError("Zero se divide nahi ho sakta", line, column);
          return left / right;
        }
        zabanError("Invalid / operands", line, column);
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      case "<":
        if (typeof left === "number" && typeof right === "number") return left < right;
        zabanError("Invalid < operands", line, column);
      case ">":
        if (typeof left === "number" && typeof right === "number") return left > right;
        zabanError("Invalid > operands", line, column);
      case "<=":
        if (typeof left === "number" && typeof right === "number") return left <= right;
        zabanError("Invalid <= operands", line, column);
      case ">=":
        if (typeof left === "number" && typeof right === "number") return left >= right;
        zabanError("Invalid >= operands", line, column);
      default:
        zabanError(`Unknown operator: ${op}`, line, column);
    }
  }

  private isTruthy(value: ZabanValue): boolean {
    if (value === null) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value.length > 0;
    return true;
  }

  private print(value: ZabanValue): void {
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
