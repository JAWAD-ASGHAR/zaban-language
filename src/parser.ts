import type {
  ProgramNode,
  StatementNode,
  ExprNode,
  IfBranchNode,
  BlockStmtNode,
  CountLoopNode,
} from "./ast.js";
import { zabanError } from "./errors.js";
import type { Token, TokenType } from "./lexer.js";

export class Parser {
  private pos = 0;

  constructor(private tokens: Token[]) {}

  parse(): ProgramNode {
    this.skipSemicolons();

    const shuruPos = this.findKeyword("shuru");
    if (shuruPos >= 0) {
      this.pos = shuruPos;
      this.advance();
      const body = this.parseStatementListUntil("khatam");
      if (!this.checkKeyword("khatam")) {
        const t = this.peek();
        zabanError("Program 'khatam' se khatam hona chahiye", t.line, t.column);
      }
      this.advance();
      return { type: "Program", body };
    }

    const body = this.parseStatementListUntil("EOF");
    return { type: "Program", body };
  }

  private findKeyword(kw: string): number {
    for (let i = this.pos; i < this.tokens.length; i++) {
      const t = this.tokens[i]!;
      if (t.type === "KEYWORD" && t.value === kw) return i;
    }
    return -1;
  }

  private parseStatementListUntil(end: "khatam" | "EOF"): StatementNode[] {
    const stmts: StatementNode[] = [];
    while (!this.isAtEnd()) {
      this.skipSemicolons();
      if (this.isAtEnd()) break;
      if (end === "khatam" && this.checkKeyword("khatam")) break;
      stmts.push(this.parseStatement());
    }
    return stmts;
  }

  private parseStatement(): StatementNode {
    const token = this.peek();

    if (token.type === "KEYWORD" && token.value === "likho") {
      return this.parsePrint();
    }
    if (token.type === "KEYWORD" && token.value === "ye") {
      return this.parseVarDecl();
    }
    if (token.type === "KEYWORD" && token.value === "agar") {
      return this.parseIf();
    }
    if (token.type === "KEYWORD" && token.value === "jab") {
      return this.parseWhile();
    }
    if (token.type === "KEYWORD" && token.value === "ghoomo") {
      return this.parseCountLoop();
    }
    if (token.type === "KEYWORD" && token.value === "bas") {
      const t = this.advance();
      this.skipSemicolons();
      return { type: "Break", line: t.line, column: t.column };
    }
    if (token.type === "KEYWORD" && token.value === "agla") {
      const t = this.advance();
      this.skipSemicolons();
      return { type: "Continue", line: t.line, column: t.column };
    }
    if (token.type === "LBRACE") {
      return this.parseBlockStmt();
    }
    if (token.type === "IDENTIFIER") {
      return this.parseAssign();
    }

    zabanError(`Statement expected, got ${token.type}`, token.line, token.column);
  }

  private parsePrint(): StatementNode {
    const t = this.advance();
    const args: ExprNode[] = [];
    if (!this.isStatementEnd()) {
      args.push(this.parseExpr());
      while (this.check("COMMA")) {
        this.advance();
        args.push(this.parseExpr());
      }
    }
    this.skipSemicolons();
    return { type: "Print", args, line: t.line, column: t.column };
  }

  private parseVarDecl(): StatementNode {
    const t = this.advance();
    this.expectKeyword("hai", "'ye hai' ke liye 'hai' chahiye");
    const nameToken = this.expect("IDENTIFIER", "Variable ka naam chahiye");
    this.expect("ASSIGN", "'=' expected in variable declaration");
    const init = this.parseExpr();
    this.skipSemicolons();
    return {
      type: "VarDecl",
      name: nameToken.value,
      init,
      line: t.line,
      column: t.column,
    };
  }

  private parseAssign(): StatementNode {
    const nameToken = this.advance();
    const opToken = this.peek();
    let operator: "=" | "+=" | "-=" | "*=" | "/=";
    if (opToken.type === "ASSIGN") operator = "=";
    else if (opToken.type === "PLUSEQ") operator = "+=";
    else if (opToken.type === "MINUSEQ") operator = "-=";
    else if (opToken.type === "STAREQ") operator = "*=";
    else if (opToken.type === "SLASHEQ") operator = "/=";
    else {
      zabanError("Assignment operator expected (=, +=, ...)", opToken.line, opToken.column);
    }
    this.advance();
    const value = this.parseExpr();
    this.skipSemicolons();
    return {
      type: "Assign",
      name: nameToken.value,
      operator,
      value,
      line: nameToken.line,
      column: nameToken.column,
    };
  }

  private parseIf(): StatementNode {
    const t = this.advance();
    const branches: IfBranchNode[] = [];
    branches.push(this.parseIfBranchBody());
    let elseBody: StatementNode[] | null = null;

    while (this.checkKeyword("nahi")) {
      this.advance();
      this.expectKeyword("to", "'nahi to agar' expected");
      if (this.checkKeyword("agar")) {
        this.advance();
        branches.push(this.parseIfBranchBody());
      } else {
        elseBody = this.parseBlockBody();
        break;
      }
    }

    if (elseBody === null && this.checkKeyword("warna")) {
      this.advance();
      elseBody = this.parseBlockBody();
    }

    return { type: "If", branches, elseBody, line: t.line, column: t.column };
  }

  private parseIfBranchBody(): IfBranchNode {
    this.expect("LPAREN", "'(' expected after agar");
    const condition = this.parseExpr();
    this.expect("RPAREN", "')' expected after condition");
    const body = this.parseBlockBody();
    return { condition, body };
  }

  private parseWhile(): StatementNode {
    const t = this.advance();
    this.expectKeyword("tak", "'jab tak' ke liye 'tak' chahiye");
    this.expect("LPAREN", "'(' expected after jab tak");
    const condition = this.parseExpr();
    this.expect("RPAREN", "')' expected after condition");
    const body = this.parseBlockBody();
    return { type: "While", condition, body, line: t.line, column: t.column };
  }

  private parseCountLoop(): CountLoopNode {
    const t = this.advance();
    const countToken = this.expect("NUMBER", "ghoomo ke baad number chahiye");
    const body = this.parseBlockBody();
    return {
      type: "CountLoop",
      count: Number(countToken.value),
      body,
      line: t.line,
      column: t.column,
    };
  }

  private parseBlockStmt(): BlockStmtNode {
    const t = this.advance();
    const body: StatementNode[] = [];
    while (!this.check("RBRACE") && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    this.expect("RBRACE", "'}' expected");
    return { type: "BlockStmt", body, line: t.line, column: t.column };
  }

  private parseBlockBody(): StatementNode[] {
    this.expect("LBRACE", "'{' expected");
    const body: StatementNode[] = [];
    while (!this.check("RBRACE") && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    this.expect("RBRACE", "'}' expected");
    return body;
  }

  private parseExpr(): ExprNode {
    return this.parseComparison();
  }

  private parseComparison(): ExprNode {
    let left = this.parseAddition();
    while (
      this.check("EQ") ||
      this.check("NEQ") ||
      this.check("LT") ||
      this.check("GT") ||
      this.check("LTE") ||
      this.check("GTE")
    ) {
      const op = this.advance();
      const right = this.parseAddition();
      left = {
        type: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  }

  private parseAddition(): ExprNode {
    let left = this.parseMultiplication();
    while (this.check("PLUS") || this.check("MINUS")) {
      const op = this.advance();
      const right = this.parseMultiplication();
      left = {
        type: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  }

  private parseMultiplication(): ExprNode {
    let left = this.parseUnary();
    while (this.check("STAR") || this.check("SLASH")) {
      const op = this.advance();
      const right = this.parseUnary();
      left = {
        type: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  }

  private parseUnary(): ExprNode {
    if (this.check("MINUS")) {
      const op = this.advance();
      const operand = this.parseUnary();
      return {
        type: "UnaryExpr",
        operator: "-",
        operand,
        line: op.line,
        column: op.column,
      };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ExprNode {
    const token = this.peek();

    if (token.type === "NUMBER") {
      this.advance();
      return {
        type: "Literal",
        value: Number(token.value),
        line: token.line,
        column: token.column,
      };
    }

    if (token.type === "STRING") {
      this.advance();
      return {
        type: "Literal",
        value: token.value,
        line: token.line,
        column: token.column,
      };
    }

    if (token.type === "KEYWORD" && (token.value === "sach" || token.value === "jhoot")) {
      this.advance();
      return {
        type: "Literal",
        value: token.value === "sach",
        line: token.line,
        column: token.column,
      };
    }

    if (token.type === "KEYWORD" && token.value === "khaali") {
      this.advance();
      return {
        type: "Literal",
        value: null,
        line: token.line,
        column: token.column,
      };
    }

    if (token.type === "IDENTIFIER") {
      this.advance();
      return {
        type: "Identifier",
        name: token.value,
        line: token.line,
        column: token.column,
      };
    }

    if (token.type === "LPAREN") {
      this.advance();
      const expr = this.parseExpr();
      this.expect("RPAREN", "')' expected");
      return expr;
    }

    zabanError(`Expression expected, got ${token.type}`, token.line, token.column);
  }

  private isStatementEnd(): boolean {
    const t = this.peek();
    if (
      t.type === "SEMICOLON" ||
      t.type === "RBRACE" ||
      t.type === "RPAREN" ||
      t.type === "COMMA" ||
      t.type === "EOF"
    ) {
      return true;
    }
    if (t.type === "KEYWORD") {
      const stmtKeywords = new Set([
        "likho", "ye", "agar", "jab", "ghoomo", "bas", "agla", "warna",
        "nahi", "khatam", "shuru", "hai", "to",
      ]);
      if (stmtKeywords.has(t.value)) return true;
    }
    return false;
  }

  private skipSemicolons(): void {
    while (this.check("SEMICOLON")) {
      this.advance();
    }
  }

  private expect(type: Token["type"], message: string): Token {
    const token = this.peek();
    if (token.type !== type) {
      zabanError(message, token.line, token.column);
    }
    return this.advance();
  }

  private expectKeyword(kw: string, message: string): Token {
    const token = this.peek();
    if (token.type !== "KEYWORD" || token.value !== kw) {
      zabanError(message, token.line, token.column);
    }
    return this.advance();
  }

  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private checkKeyword(kw: string): boolean {
    const t = this.peek();
    return t.type === "KEYWORD" && t.value === kw;
  }

  private peek(): Token {
    return this.tokens[this.pos]!;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.pos++;
    return this.tokens[this.pos - 1]!;
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }
}
