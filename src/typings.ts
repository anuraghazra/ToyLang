export namespace tl {
  //
  // Basic
  //
  export enum SyntaxKind {
    Program = "Program",
    Identifier = "Identifier",
    StringLiteral = "StringLiteral",
    NumericLiteral = "NumericLiteral",
    NullLiteral = "NullLiteral",
    BooleanLiteral = "BooleanLiteral",
    ClassDeclaration = "ClassDeclaration",
    FunctionDeclaration = "FunctionDeclaration",
    VariableDeclaration = "VariableDeclaration",
    VariableStatement = "VariableStatement",
    Super = "Super",
    NewExpression = "NewExpression",
    ThisExpression = "ThisExpression",
    UnaryExpression = "UnaryExpression",
    MemberExpression = "MemberExpression",
    CallExpression = "CallExpression",
    AssignmentExpression = "AssignmentExpression",
    BinaryExpression = "BinaryExpression",
    LogicalExpression = "LogicalExpression",
    ExpressionStatement = "ExpressionStatement",
    ReturnStatement = "ReturnStatement",
    EmptyStatement = "EmptyStatement",
    BlockStatement = "BlockStatement",
    IfStatement = "IfStatement",
    ForStatement = "ForStatement",
    WhileStatement = "WhileStatement",
    DoWhileStatement = "DoWhileStatement",
  }

  export interface Program {
    type: SyntaxKind.Program;
    body: Statement[];
  }
  export interface Identifier {
    type: SyntaxKind.Identifier;
    name: string;
  }

  export interface StringLiteral {
    type: SyntaxKind.StringLiteral;
    value: string;
  }
  export interface NumericLiteral {
    type: SyntaxKind.NumericLiteral;
    value: number;
  }
  export interface NullLiteral {
    type: SyntaxKind.NullLiteral;
    value: null;
  }
  export interface BooleanLiteral {
    type: SyntaxKind.BooleanLiteral;
    value: boolean;
  }
  export type Literal =
    | StringLiteral
    | NumericLiteral
    | BooleanLiteral
    | NullLiteral;

  export interface ClassDeclaration {
    type: SyntaxKind.ClassDeclaration;
    superClass: Identifier | null;
    id: Identifier;
    body: BlockStatement;
  }

  export interface FunctionDeclaration {
    type: SyntaxKind.FunctionDeclaration;
    name: Identifier;
    body: BlockStatement;
    params: Identifier[] | null;
  }

  export interface VariableDeclaration {
    type: SyntaxKind.VariableDeclaration;
    id: Identifier;
    init: Literal | Expression | null;
  }

  export interface VariableStatement {
    type: SyntaxKind.VariableStatement;
    declarations: VariableDeclaration[];
  }

  //
  // Expressions
  //
  export interface Super {
    type: SyntaxKind.Super;
  }

  export interface NewExpression {
    type: SyntaxKind.NewExpression;
    callee: MemberExpression;
    arguments: Arguments;
  }

  export interface ThisExpression {
    type: SyntaxKind.ThisExpression;
  }

  export type UnaryOperators = "+" | "-";
  export interface UnaryExpression {
    type: SyntaxKind.UnaryExpression;
    operator: string;
    argument: CallExpression | CallMemberExpression | UnaryExpression;
  }

  export interface MemberExpression {
    type: SyntaxKind.MemberExpression;
    computed?: boolean;
    object: any;
    property: Identifier | Expression;
  }

  export type CallMemberExpression = MemberExpression | CallExpression;

  export interface CallExpression {
    type: SyntaxKind.CallExpression;
    callee: MemberExpression;
    arguments: Arguments;
  }

  export type Arguments = (
    | CallExpression
    | AssignmentExpression
    | MemberExpression
    | LogicalExpression
  )[];

  export type AssignmentOperators = "=" | "+=" | "-=" | "/=" | "*=";
  export interface AssignmentExpression {
    type: SyntaxKind.AssignmentExpression;
    operator: AssignmentOperators;
    left: Identifier | LogicalExpression | BinaryExpression | Expression;
    right: Identifier | LogicalExpression | BinaryExpression | Expression;
  }

  export interface BinaryExpression {
    type: SyntaxKind.BinaryExpression;
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
    type: SyntaxKind.LogicalExpression;
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

  export type PrimaryExpression =
    | Literal
    | Identifier
    | Expression
    | NewExpression
    | ThisExpression
    | MemberExpression
    | CallMemberExpression;

  export type Expression =
    | CallExpression
    | AssignmentExpression
    | MemberExpression
    | LogicalExpression;

  //
  // Statements
  //

  export interface ExpressionStatement {
    type: SyntaxKind.ExpressionStatement;
    expression: Expression;
  }

  export interface ReturnStatement {
    type: SyntaxKind.ReturnStatement;
    argument: Expression | null;
  }

  export interface EmptyStatement {
    type: SyntaxKind.EmptyStatement;
  }

  export interface BlockStatement {
    type: SyntaxKind.BlockStatement;
    body: Statement[];
  }

  export interface FunctionStatement {
    type: SyntaxKind.FunctionDeclaration;
    name: Identifier;
    body: BlockStatement;
    params: Identifier[] | null;
  }

  export interface IfStatement {
    type: SyntaxKind.IfStatement;
    test: Literal | Identifier | Expression;
    consequent: Statement;
    alternate: Statement | null;
  }

  export interface ForStatement {
    type: SyntaxKind.ForStatement;
    test: Expression | null;
    init: VariableStatement | Expression | null;
    update: Expression | null;
    body: Statement;
  }

  export interface WhileStatement {
    type: SyntaxKind.WhileStatement;
    test: Expression;
    body: Statement;
  }
  export interface DoWhileStatement {
    type: SyntaxKind.DoWhileStatement;
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
}
