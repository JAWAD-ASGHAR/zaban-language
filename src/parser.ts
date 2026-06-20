import type { Token, TokenType } from "./lexer.js";
import { zabanError } from "./errors.js";

export type Expr =
    | { type: "NumberLiteral"; value: number }
    | { type: "StringLiteral"; value: string }
    | { type: "BooleanLiteral"; value: boolean }
    | { type: "NullLiteral" }
    | { type: "Identifier"; name: string }
    | { type: "UnaryExpr"; operator: string; right: Expr }
    | { type: "BinaryExpr"; operator: string; left: Expr; right: Expr }
    | { type: "AssignExpr"; name: string; operator: string; value: Expr };


export type Program = {
    type: "Program";
    body: Stmt[];
};

export type Stmt =
    | { type: "VarDecl"; name: string; value: Expr }
    | { type: "PrintStmt"; values: Expr[] }
    | { type: "IfStmt"; condition: Expr; thenBranch: Stmt; elseBranch?: Stmt }
    | { type: "WhileStmt"; condition: Expr; body: Stmt }
    | { type: "BlockStmt"; body: Stmt[] }
    | { type: "BreakStmt" }
    | { type: "ContinueStmt" }
    | { type: "ExprStmt"; expr: Expr };

export class Parser {
    private current = 0;

    constructor(private tokens: Token[]) { }

    parse(): Program {
        return this.parseProgram();
    }

    private parseProgram(): Program {
        const shuruIndex = this.tokens.findIndex(t => t.type === "KEYWORD" && t.value === "shuru");

        const body: Stmt[] = [];

        if (shuruIndex !== -1) {
            this.current = shuruIndex + 1;

            while (!this.checkKeyword("khatam") && !this.isAtEnd()) {
                body.push(this.parseStatement());
            }

            this.consumeKeyword("khatam", "Program khatam se end hona chahiye");

            while (!this.isAtEnd()) {
                this.advance();
            }
        } else {
            this.current = 0;
            while (!this.isAtEnd()) {
                body.push(this.parseStatement());
            }
        }

        this.consume("EOF", "Expected EOF");

        return { type: "Program", body };
    }

    private parseStatement(): Stmt {
        if (this.matchKeyword("ye")) return this.parseVarDecl();
        if (this.matchKeyword("likho")) return this.parsePrint();
        if (this.matchKeyword("agar")) return this.parseIf();
        if (this.matchKeyword("jab")) return this.parseWhile();
        if (this.match("LBRACE")) return this.parseBlock();
        if (this.matchKeyword("bas")) return this.parseBreak();
        if (this.matchKeyword("agla")) return this.parseContinue();

        return this.parseExprStmt();
    }

    private parseVarDecl(): Stmt {
        this.consumeKeyword("hai", "Expected 'hai' after 'ye'");

        const name = this.consume("IDENTIFIER", "Expected variable name");
        this.consume("ASSIGN", "Expected '=' after variable name");

        const value = this.parseExpression();

        this.match("SEMICOLON");

        return {
            type: "VarDecl",
            name: name.value,
            value,
        };
    }

    private parsePrint(): Stmt {
        const values: Expr[] = [];
        values.push(this.parseExpression());

        while (this.match("COMMA")) {
            values.push(this.parseExpression());
        }

        this.match("SEMICOLON");

        return {
            type: "PrintStmt",
            values,
        };
    }

    private parseIf(): Stmt {
        this.consume("LPAREN", "Expected '(' after agar");
        const condition = this.parseExpression();
        this.consume("RPAREN", "Expected ')' after condition");

        const thenBranch = this.parseStatement();

        let elseBranch: Stmt | undefined;

        if (this.matchKeyword("nahi")) {
            this.consumeKeyword("to", "Expected 'to' after 'nahi'");

            if (this.matchKeyword("agar")) {
                elseBranch = this.parseIf();
            } else {
                elseBranch = this.parseStatement();
            }
        }

        return {
            type: "IfStmt",
            condition,
            thenBranch,
            elseBranch,
        };
    }

    private parseWhile(): Stmt {
        this.consumeKeyword("tak", "Expected 'tak' after 'jab'");

        this.consume("LPAREN", "Expected '(' after jab tak");
        const condition = this.parseExpression();
        this.consume("RPAREN", "Expected ')' after condition");

        const body = this.parseStatement();

        return {
            type: "WhileStmt",
            condition,
            body,
        };
    }

    private parseBlock(): Stmt {
        const body: Stmt[] = [];

        while (!this.check("RBRACE") && !this.isAtEnd()) {
            body.push(this.parseStatement());
        }

        this.consume("RBRACE", "Expected '}' after block");

        return {
            type: "BlockStmt",
            body,
        };
    }

    private parseBreak(): Stmt {
        this.match("SEMICOLON");
        return { type: "BreakStmt" };
    }

    private parseContinue(): Stmt {
        this.match("SEMICOLON");
        return { type: "ContinueStmt" };
    }

    private parseExprStmt(): Stmt {
        const expr = this.parseExpression();

        this.match("SEMICOLON");

        return {
            type: "ExprStmt",
            expr,
        };
    }
    private parseExpression(): Expr {
        return this.parseAssignment();
    }

    private parseAssignment(): Expr {
        const expr = this.parseEquality();

        if (this.match("ASSIGN", "PLUSEQ", "MINUSEQ", "STAREQ", "SLASHEQ")) {
            const operator = this.previous().value;
            const value = this.parseAssignment();

            if (expr.type !== "Identifier") {
                const token = this.previous();
                zabanError("Invalid assignment target", token.line, token.column);
            }

            return {
                type: "AssignExpr",
                name: expr.name,
                operator,
                value,
            };
        }

        return expr;
    }

    private parseEquality(): Expr {
        let expr = this.parseComparison();

        while (this.match("EQ", "NEQ")) {
            const operator = this.previous().value;
            const right = this.parseComparison();

            expr = {
                type: "BinaryExpr",
                operator,
                left: expr,
                right,
            };
        }

        return expr;
    }

    private parseComparison(): Expr {
        let expr = this.parseTerm();

        while (this.match("LT", "GT", "LTE", "GTE")) {
            const operator = this.previous().value;
            const right = this.parseTerm();

            expr = {
                type: "BinaryExpr",
                operator,
                left: expr,
                right,
            };
        }

        return expr;
    }

    private parseTerm(): Expr {
        let expr = this.parseFactor();

        while (this.match("PLUS", "MINUS")) {
            const operator = this.previous().value;
            const right = this.parseFactor();

            expr = {
                type: "BinaryExpr",
                operator,
                left: expr,
                right,
            };
        }

        return expr;
    }

    private parseUnary(): Expr {
        if (this.match("MINUS")) {
            const operator = this.previous().value;
            const right = this.parseUnary();

            return {
                type: "UnaryExpr",
                operator,
                right,
            };
        }

        return this.parsePrimary();
    }

    private parseFactor(): Expr {
        let expr = this.parseUnary();

        while (this.match("STAR", "SLASH")) {
            const operator = this.previous().value;
            const right = this.parseUnary();

            expr = {
                type: "BinaryExpr",
                operator,
                left: expr,
                right,
            };
        }

        return expr;
    }

    private parsePrimary(): Expr {
        if (this.match("NUMBER")) {
            return {
                type: "NumberLiteral",
                value: Number(this.previous().value),
            };
        }

        if (this.match("STRING")) {
            return {
                type: "StringLiteral",
                value: this.previous().value,
            };
        }

        if (this.match("IDENTIFIER")) {
            return {
                type: "Identifier",
                name: this.previous().value,
            };
        }

        if (this.matchKeyword("sach")) {
            return {
                type: "BooleanLiteral",
                value: true,
            };
        }

        if (this.matchKeyword("jhoot")) {
            return {
                type: "BooleanLiteral",
                value: false,
            };
        }

        if (this.matchKeyword("khaali")) {
            return {
                type: "NullLiteral",
            };
        }

        if (this.match("LPAREN")) {
            const expr = this.parseExpression();
            this.consume("RPAREN", "Expected ')' after expression");
            return expr;
        }

        const token = this.peek();
        zabanError(`Unexpected token: ${token.value}`, token.line, token.column);
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    private matchKeyword(value: string): boolean {
        if (this.checkKeyword(value)) {
            this.advance();
            return true;
        }

        return false;
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();

        const token = this.peek();
        zabanError(message, token.line, token.column);
    }

    private consumeKeyword(value: string, message: string): Token {
        if (this.checkKeyword(value)) return this.advance();

        const token = this.peek();
        zabanError(message, token.line, token.column);
    }

    private check(type: TokenType): boolean {
        return this.peek().type === type;
    }

    private checkKeyword(value: string): boolean {
        const token = this.peek();
        return token.type === "KEYWORD" && token.value === value;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === "EOF";
    }

    private peek(): Token {
        return this.tokens[this.current]!;
    }

    private previous(): Token {
        return this.tokens[this.current - 1]!;
    }
}