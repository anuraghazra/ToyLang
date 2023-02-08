import { tl } from "./typings";

type ForParams = {
  test: tl.ForStatement["test"] | null;
  init: tl.ForStatement["init"] | null;
  update: tl.ForStatement["update"] | null;
  body: tl.ForStatement["body"];
};

type ForReturn = {
  type: tl.SyntaxKind.ForStatement;
  test: tl.ForStatement["test"] | null;
  init: tl.ForStatement["init"] | null;
  update: tl.ForStatement["update"] | null;
  body: tl.ForStatement["body"];
};

export interface ASTFactory {
  Program(body: tl.Statement[]): tl.Program;
  EmptyStatement(): tl.EmptyStatement;
  BlockStatement(body: tl.Statement[]): tl.BlockStatement;
  ExpressionStatement(expression: tl.Expression): tl.ExpressionStatement;
  IfStatement(
    test: tl.IfStatement["test"],
    consequent: tl.IfStatement["consequent"],
    alternate: tl.IfStatement["alternate"]
  ): tl.IfStatement;
  ForStatement(props: ForParams): ForReturn;
  ReturnStatement(argument: tl.Expression | null): tl.ReturnStatement;
  WhileStatement(test: tl.Expression, body: tl.Statement): tl.WhileStatement;
  DoWhileStatement(
    test: tl.Expression,
    body: tl.Statement
  ): tl.DoWhileStatement;
  VariableStatement(
    declarations: tl.VariableDeclaration[]
  ): tl.VariableStatement;

  VariableDeclaration(
    id: tl.Identifier,
    init: tl.VariableDeclaration["init"]
  ): tl.VariableDeclaration;
  AssignmentExpression({
    operator,
    left,
    right,
  }: Omit<tl.AssignmentExpression, "type">): tl.AssignmentExpression;
  BinaryExpression(
    operator: string,
    left: tl.BinaryExpression["left"],
    right: tl.BinaryExpression["right"]
  ): tl.BinaryExpression;
  LogicalExpression(
    operator: string,
    left: tl.LogicalExpression["left"],
    right: tl.LogicalExpression["right"]
  ): tl.LogicalExpression;
  Identifier(name: string): tl.Identifier;
  NullLiteral(): tl.NullLiteral;
  ThisExpression(): tl.ThisExpression;
  Super(): tl.Super;
  BooleanLiteral(value: boolean): tl.BooleanLiteral;
  StringLiteral(value: string): tl.StringLiteral;
  NumericLiteral(value: number): tl.NumericLiteral;
  NewExpression(
    callee: tl.MemberExpression,
    args: tl.Arguments
  ): tl.NewExpression;
  UnaryExpression(
    operator: string,
    argument: tl.CallExpression | tl.CallMemberExpression | tl.UnaryExpression
  ): tl.UnaryExpression;
  ClassDeclaration(
    id: tl.Identifier,
    body: tl.BlockStatement,
    superClass: tl.Identifier | null
  ): tl.ClassDeclaration;
  FunctionStatement(
    name: tl.Identifier,
    body: tl.BlockStatement,
    params: tl.Identifier[] | null
  ): tl.FunctionDeclaration;
}

export const DefaultASTFactory: ASTFactory = {
  Program(body) {
    return { type: tl.SyntaxKind.Program, body };
  },
  EmptyStatement() {
    return { type: tl.SyntaxKind.EmptyStatement };
  },
  BlockStatement(body) {
    return {
      type: tl.SyntaxKind.BlockStatement,
      body,
    };
  },
  ExpressionStatement(expression) {
    return {
      type: tl.SyntaxKind.ExpressionStatement,
      expression,
    };
  },
  IfStatement(test, consequent, alternate) {
    return {
      type: tl.SyntaxKind.IfStatement,
      test,
      consequent,
      alternate,
    };
  },
  ReturnStatement(argument) {
    return {
      type: tl.SyntaxKind.ReturnStatement,
      argument,
    };
  },
  WhileStatement(test, body) {
    return {
      type: tl.SyntaxKind.WhileStatement,
      test,
      body,
    };
  },
  DoWhileStatement(test, body) {
    return {
      type: tl.SyntaxKind.DoWhileStatement,
      test,
      body,
    };
  },
  ForStatement(props) {
    return {
      type: tl.SyntaxKind.ForStatement,
      test: props.test,
      init: props.init,
      update: props.update,
      body: props.body,
    };
  },
  VariableStatement(declarations) {
    return {
      type: tl.SyntaxKind.VariableStatement,
      declarations,
    };
  },
  VariableDeclaration(id, init) {
    return {
      type: tl.SyntaxKind.VariableDeclaration,
      id,
      init,
    };
  },
  AssignmentExpression({ operator, left, right }) {
    return {
      type: tl.SyntaxKind.AssignmentExpression,
      operator,
      left,
      right,
    };
  },
  BinaryExpression(operator, left, right) {
    return {
      type: tl.SyntaxKind.BinaryExpression,
      operator,
      left,
      right,
    };
  },
  LogicalExpression(operator, left, right) {
    return {
      type: tl.SyntaxKind.LogicalExpression,
      operator,
      left,
      right,
    };
  },
  Identifier(name) {
    return { type: tl.SyntaxKind.Identifier, name };
  },
  NullLiteral() {
    return {
      type: tl.SyntaxKind.NullLiteral,
      value: null,
    };
  },
  BooleanLiteral(value) {
    return {
      type: tl.SyntaxKind.BooleanLiteral,
      value: value,
    };
  },
  StringLiteral(value) {
    return {
      type: tl.SyntaxKind.StringLiteral,
      value: value,
    };
  },
  NumericLiteral(value) {
    return {
      type: tl.SyntaxKind.NumericLiteral,
      value,
    };
  },
  NewExpression(callee, args) {
    return {
      type: tl.SyntaxKind.NewExpression,
      callee,
      arguments: args,
    };
  },
  UnaryExpression(operator, argument) {
    return {
      type: tl.SyntaxKind.UnaryExpression,
      operator,
      argument,
    };
  },
  ThisExpression() {
    return {
      type: tl.SyntaxKind.ThisExpression,
    };
  },
  Super() {
    return {
      type: tl.SyntaxKind.Super,
    };
  },

  ClassDeclaration(id, body, superClass) {
    return {
      type: tl.SyntaxKind.ClassDeclaration,
      superClass,
      id,
      body,
    };
  },
  FunctionStatement(name, body, params) {
    return {
      type: tl.SyntaxKind.FunctionDeclaration,
      name,
      body,
      params,
    };
  },
};

export const SExpressionFactory = {
  Program(body: any) {
    return ["begin", body];
  },
  EmptyStatement() {},
  BlockStatement(body: any) {
    return ["begin", body];
  },
  ExpressionStatement(expression: any) {
    return expression;
  },
  StringLiteral(value: any) {
    return `${value}`;
  },
  NumericLiteral(value: any) {
    return value;
  },
};
