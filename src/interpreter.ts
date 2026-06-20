import type { Program, Stmt, Expr } from "./parser.js";
import { zabanError } from "./errors.js";

type RuntimeValue = number | string | boolean | null;

class BreakSignal extends Error {}
class ContinueSignal extends Error {}

class Environment {
  private values = new Map<string, RuntimeValue>();

  constructor(private parent?: Environment) {}

  define(name: string, value: RuntimeValue): void {
    if (this.values.has(name)) {
      throw new Error(`Variable '${name}' already declared`);
    }

    this.values.set(name, value);
  }

  get(name: string): RuntimeValue {
    if (this.values.has(name)) {
      return this.values.get(name)!;
    }

    if (this.parent) {
      return this.parent.get(name);
    }

    throw new Error(`Undefined variable '${name}'`);
  }

  assign(name: string, value: RuntimeValue): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }

    if (this.parent) {
      this.parent.assign(name, value);
      return;
    }

    throw new Error(`Undefined variable '${name}'`);
  }
}

export class Interpreter {
  private env = new Environment();

  interpret(program: Program): void {
    try {
      for (const stmt of program.body) {
        this.execute(stmt);
      }
    } catch (error) {
      if (error instanceof BreakSignal) {
        throw new Error("'bas' used outside loop");
      }

      if (error instanceof ContinueSignal) {
        throw new Error("'agla' used outside loop");
      }

      throw error;
    }
  }

  private execute(stmt: Stmt): void {
    switch (stmt.type) {
      case "VarDecl":
        this.executeVarDecl(stmt);
        return;

      case "PrintStmt":
        console.log(this.stringify(this.evaluate(stmt.value)));
        return;

      case "ExprStmt":
        this.evaluate(stmt.expr);
        return;

      case "BlockStmt":
        this.executeBlock(stmt.body, new Environment(this.env));
        return;

      case "IfStmt":
        this.executeIf(stmt);
        return;

      case "WhileStmt":
        this.executeWhile(stmt);
        return;

      case "BreakStmt":
        throw new BreakSignal();

      case "ContinueStmt":
        throw new ContinueSignal();

      default:
        this.unreachable(stmt);
    }
  }

  private executeVarDecl(stmt: Extract<Stmt, { type: "VarDecl" }>): void {
    const value = this.evaluate(stmt.value);
    this.env.define(stmt.name, value);
  }

  private executeBlock(body: Stmt[], environment: Environment): void {
    const previous = this.env;

    try {
      this.env = environment;

      for (const stmt of body) {
        this.execute(stmt);
      }
    } finally {
      this.env = previous;
    }
  }

  private executeIf(stmt: Extract<Stmt, { type: "IfStmt" }>): void {
    const condition = this.evaluate(stmt.condition);

    if (this.isTruthy(condition)) {
      this.execute(stmt.thenBranch);
      return;
    }

    if (stmt.elseBranch) {
      this.execute(stmt.elseBranch);
    }
  }

  private executeWhile(stmt: Extract<Stmt, { type: "WhileStmt" }>): void {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      try {
        this.execute(stmt.body);
      } catch (error) {
        if (error instanceof BreakSignal) {
          break;
        }

        if (error instanceof ContinueSignal) {
          continue;
        }

        throw error;
      }
    }
  }

  private evaluate(expr: Expr): RuntimeValue {
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
        return this.env.get(expr.name);

      case "UnaryExpr":
        return this.evaluateUnary(expr);

      case "BinaryExpr":
        return this.evaluateBinary(expr);

      case "AssignExpr":
        return this.evaluateAssignment(expr);

      default:
        this.unreachable(expr);
    }
  }

  private evaluateUnary(expr: Extract<Expr, { type: "UnaryExpr" }>): RuntimeValue {
    const right = this.evaluate(expr.right);

    switch (expr.operator) {
      case "-":
        this.assertNumber(right, "Unary '-' expects a number");
        return -right;

      default:
        throw new Error(`Unknown unary operator '${expr.operator}'`);
    }
  }

  private evaluateBinary(expr: Extract<Expr, { type: "BinaryExpr" }>): RuntimeValue {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator) {
      case "+":
        if (typeof left === "string" || typeof right === "string") {
          return String(left) + String(right);
        }

        this.assertNumber(left, "'+' left side must be a number or string");
        this.assertNumber(right, "'+' right side must be a number or string");
        return left + right;

      case "-":
        this.assertNumber(left, "'-' left side must be a number");
        this.assertNumber(right, "'-' right side must be a number");
        return left - right;

      case "*":
        this.assertNumber(left, "'*' left side must be a number");
        this.assertNumber(right, "'*' right side must be a number");
        return left * right;

      case "/":
        this.assertNumber(left, "'/' left side must be a number");
        this.assertNumber(right, "'/' right side must be a number");

        if (right === 0) {
          throw new Error("Division by zero");
        }

        return left / right;

      case "==":
        return left === right;

      case "!=":
        return left !== right;

      case "<":
        this.assertNumber(left, "'<' left side must be a number");
        this.assertNumber(right, "'<' right side must be a number");
        return left < right;

      case ">":
        this.assertNumber(left, "'>' left side must be a number");
        this.assertNumber(right, "'>' right side must be a number");
        return left > right;

      case "<=":
        this.assertNumber(left, "'<=' left side must be a number");
        this.assertNumber(right, "'<=' right side must be a number");
        return left <= right;

      case ">=":
        this.assertNumber(left, "'>=' left side must be a number");
        this.assertNumber(right, "'>=' right side must be a number");
        return left >= right;

      default:
        throw new Error(`Unknown binary operator '${expr.operator}'`);
    }
  }

  private evaluateAssignment(expr: Extract<Expr, { type: "AssignExpr" }>): RuntimeValue {
    const oldValue = this.env.get(expr.name);
    const value = this.evaluate(expr.value);

    let finalValue: RuntimeValue;

    switch (expr.operator) {
      case "=":
        finalValue = value;
        break;

      case "+=":
        if (typeof oldValue === "string" || typeof value === "string") {
          finalValue = String(oldValue) + String(value);
        } else {
          this.assertNumber(oldValue, "'+=' old value must be a number or string");
          this.assertNumber(value, "'+=' new value must be a number or string");
          finalValue = oldValue + value;
        }
        break;

      case "-=":
        this.assertNumber(oldValue, "'-=' old value must be a number");
        this.assertNumber(value, "'-=' new value must be a number");
        finalValue = oldValue - value;
        break;

      case "*=":
        this.assertNumber(oldValue, "'*=' old value must be a number");
        this.assertNumber(value, "'*=' new value must be a number");
        finalValue = oldValue * value;
        break;

      case "/=":
        this.assertNumber(oldValue, "'/=' old value must be a number");
        this.assertNumber(value, "'/=' new value must be a number");

        if (value === 0) {
          throw new Error("Division by zero");
        }

        finalValue = oldValue / value;
        break;

      default:
        throw new Error(`Unknown assignment operator '${expr.operator}'`);
    }

    this.env.assign(expr.name, finalValue);
    return finalValue;
  }

  private isTruthy(value: RuntimeValue): boolean {
    return value !== false && value !== null && value !== 0 && value !== "";
  }

  private stringify(value: RuntimeValue): string {
    if (value === null) return "khaali";
    if (value === true) return "sach";
    if (value === false) return "jhoot";
    return String(value);
  }

  private assertNumber(value: RuntimeValue, message: string): asserts value is number {
    if (typeof value !== "number") {
      throw new Error(message);
    }
  }

  private unreachable(value: never): never {
    throw new Error(`Unknown AST node: ${JSON.stringify(value)}`);
  }
}