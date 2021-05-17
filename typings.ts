//
// Basic
//
export interface Program {
  type: "Program";
  body: Statement[];
}
export interface Identifier {
  type: "Identifier";
  name: string;
}

export interface StringLiteral {
  type: "StringLiteral";
  value: string;
}
export interface NumericLiteral {
  type: "NumericLiteral";
  value: number;
}
export interface NullLiteral {
  type: "NullLiteral";
  value: null;
}
export interface BooleanLiteral {
  type: "BooleanLiteral";
  value: boolean;
}
export type Literal =
  | StringLiteral
  | NumericLiteral
  | BooleanLiteral
  | NullLiteral;

export interface ClassDeclaration {
  type: "ClassDeclaration";
  superClass: Identifier | null;
  id: Identifier;
  body: BlockStatement;
}

export interface FunctionDeclaration {
  type: "FunctionDeclaration";
  name: Identifier;
  body: BlockStatement;
  params: Identifier[] | null;
}

export interface VariableDeclaration {
  type: "VariableDeclaration";
  id: Identifier;
  init: Literal | Expression | null;
}

export interface VariableStatement {
  type: "VariableStatement";
  declarations: VariableDeclaration[];
}

//
// Expressions
//

export interface Super {
  type: "Super";
}

export interface NewExpression {
  type: "NewExpression";
  callee: MemberExpression;
  arguments: Arguments;
}

export interface ThisExpression {
  type: "ThisExpression";
}

export type UnaryOperators = "+" | "-";
export interface UnaryExpression {
  type: "UnaryExpression";
  operator: string;
  argument: CallMemberExpression | UnaryExpression;
}

export interface MemberExpression {
  type: "MemberExpression";
  computed?: boolean;
  object: any;
  property: Identifier | Expression;
}

export type CallMemberExpression =
  | MemberExpression
  | {
      type: string;
      callee: MemberExpression | Super;
      arguments: Arguments;
    };

export interface CallExpression {
  type: "CallExpression";
  callee: MemberExpression;
  arguments: Arguments;
}

export type Arguments = (
  | CallExpression
  | AssignmentExpression
  | MemberExpression
  | LogicalExpression
)[];

export type AssignmentOperators = "==" | "+=" | "-=" | "/=" | "*=";
export interface AssignmentExpression {
  type: "AssignmentExpression";
  operator: AssignmentOperators;
  left: Identifier | LogicalExpression | BinaryExpression | Expression;
  right: Identifier | LogicalExpression | BinaryExpression | Expression;
}

export interface BinaryExpression {
  type: "BinaryExpression";
  operator: string;
  left:
    | LogicalExpression
    | BinaryExpression
    | Identifier
    | Literal
    | Expression;
  right:
    | LogicalExpression
    | BinaryExpression
    | Identifier
    | Literal
    | Expression;
}

export interface LogicalExpression {
  type: "LogicalExpression";
  operator: string;
  left:
    | LogicalExpression
    | BinaryExpression
    | Identifier
    | Literal
    | Expression;
  right:
    | LogicalExpression
    | BinaryExpression
    | Identifier
    | Literal
    | Expression;
}

// export type PrimaryExpression =
//   | NewExpression
//   | ThisExpression
//   | Identifier
//   | Literal
//   | Expression
//   | MemberExpression
//   | CallMemberExpression;

export type Expression =
  | AssignmentExpression
  | CallExpression
  | AssignmentExpression
  | MemberExpression
  | LogicalExpression;

//
// Statements
//

export interface ExpressionStatement {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface ReturnStatement {
  type: "ReturnStatement";
  argument: Expression | null;
}

export interface EmptyStatement {
  type: "EmptyStatement";
}

export interface BlockStatement {
  type: "BlockStatement";
  body: Statement[];
}

export interface FunctionStatement {
  type: "FunctionDeclaration";
  name: Identifier;
  body: BlockStatement;
  params: Identifier[] | null;
}

export interface IfStatement {
  type: "IfStatement";
  test: Literal | Identifier | Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface ForStatement {
  type: "ForStatement";
  test: Expression | null;
  init: VariableStatement | Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface WhileStatement {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}
export interface DoWhileStatement {
  type: "DoWhileStatement";
  test: Expression;
  body: Statement;
}

export type IterationStatement =
  | ForStatement
  | WhileStatement
  | DoWhileStatement;

export type Statement =
  | VariableStatement
  | IfStatement
  | IterationStatement
  | FunctionStatement
  | ReturnStatement
  | ClassDeclaration
  | EmptyStatement
  | BlockStatement
  | ExpressionStatement;
