import { zabanError } from "../errors.js";

export class Environment {
  private vars = new Map<string, unknown>();

  constructor(private parent?: Environment) {}

  defineVar(name: string, value: unknown, line: number, column: number): void {
    if (this.vars.has(name)) {
      zabanError(`Variable '${name}' pehle se mojood hai`, line, column);
    }
    this.vars.set(name, value);
  }

  assignVar(name: string, value: unknown, line: number, column: number): void {
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

  getVar(name: string, line: number, column: number): unknown {
    if (this.vars.has(name)) {
      return this.vars.get(name);
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
