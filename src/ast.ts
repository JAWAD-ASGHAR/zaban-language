export type LiteralValue = string | number | boolean | null;

export interface LiteralNode {
  type: "Literal";
  value: LiteralValue;
  line: number;
  column: number;
}

export interface IdentifierNode {
  type: "Identifier";
  name: string;
  line: number;
  column: number;
}

export interface BinaryExprNode {
  type: "BinaryExpr";
  operator: string;
  left: ExprNode;
  right: ExprNode;
  line: number;
  column: number;
}

export interface UnaryExprNode {
  type: "UnaryExpr";
  operator: string;
  operand: ExprNode;
  line: number;
  column: number;
}

export type ExprNode =
  | LiteralNode
  | IdentifierNode
  | BinaryExprNode
  | UnaryExprNode;

export interface PrintNode {
  type: "Print";
  args: ExprNode[];
  line: number;
  column: number;
}

export interface VarDeclNode {
  type: "VarDecl";
  name: string;
  init: ExprNode;
  line: number;
  column: number;
}

export interface AssignNode {
  type: "Assign";
  name: string;
  operator: "=" | "+=" | "-=" | "*=" | "/=";
  value: ExprNode;
  line: number;
  column: number;
}

export interface BlockStmtNode {
  type: "BlockStmt";
  body: StatementNode[];
  line: number;
  column: number;
}

export interface IfBranchNode {
  condition: ExprNode;
  body: StatementNode[];
}

export interface IfNode {
  type: "If";
  branches: IfBranchNode[];
  elseBody: StatementNode[] | null;
  line: number;
  column: number;
}

export interface WhileNode {
  type: "While";
  condition: ExprNode;
  body: StatementNode[];
  line: number;
  column: number;
}

export interface CountLoopNode {
  type: "CountLoop";
  count: number;
  body: StatementNode[];
  line: number;
  column: number;
}

export interface BreakNode {
  type: "Break";
  line: number;
  column: number;
}

export interface ContinueNode {
  type: "Continue";
  line: number;
  column: number;
}

export type StatementNode =
  | PrintNode
  | VarDeclNode
  | AssignNode
  | BlockStmtNode
  | IfNode
  | WhileNode
  | CountLoopNode
  | BreakNode
  | ContinueNode;

export interface ProgramNode {
  type: "Program";
  body: StatementNode[];
}
