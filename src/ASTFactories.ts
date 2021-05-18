import { ToyLang } from "./typings";

type ForParams = {
  test: ToyLang.ForStatement["test"] | null;
  init: ToyLang.ForStatement["init"] | null;
  update: ToyLang.ForStatement["update"] | null;
  body: ToyLang.ForStatement["body"];
};
type ForReturn = ForParams & {
  type: "ForStatement";
};

export interface ASTFactory {
  Program(body: ToyLang.Statement[]): ToyLang.Program;
  EmptyStatement(): ToyLang.EmptyStatement;
  BlockStatement(body: ToyLang.Statement[]): ToyLang.BlockStatement;
  ExpressionStatement(
    expression: ToyLang.Expression
  ): ToyLang.ExpressionStatement;
  IfStatement(
    test: ToyLang.IfStatement["test"],
    consequent: ToyLang.IfStatement["consequent"],
    alternate: ToyLang.IfStatement["alternate"]
  ): ToyLang.IfStatement;
  ForStatement(props: ForParams): ForReturn;
  ReturnStatement(argument: ToyLang.Expression | null): ToyLang.ReturnStatement;
  WhileStatement(
    test: ToyLang.Expression,
    body: ToyLang.Statement
  ): ToyLang.WhileStatement;
  DoWhileStatement(
    test: ToyLang.Expression,
    body: ToyLang.Statement
  ): ToyLang.DoWhileStatement;
  VariableStatement(
    declarations: ToyLang.VariableDeclaration[]
  ): ToyLang.VariableStatement;

  VariableDeclaration(
    id: ToyLang.Identifier,
    init: ToyLang.VariableDeclaration["init"]
  ): ToyLang.VariableDeclaration;
  AssignmentExpression({
    operator,
    left,
    right,
  }: Omit<ToyLang.AssignmentExpression, "type">): ToyLang.AssignmentExpression;
  BinaryExpression(
    operator: string,
    left: ToyLang.BinaryExpression["left"],
    right: ToyLang.BinaryExpression["right"]
  ): ToyLang.BinaryExpression;
  LogicalExpression(
    operator: string,
    left: ToyLang.LogicalExpression["left"],
    right: ToyLang.LogicalExpression["right"]
  ): ToyLang.LogicalExpression;
  Identifier(name: string): ToyLang.Identifier;
  NullLiteral(): ToyLang.NullLiteral;
  ThisExpression(): ToyLang.ThisExpression;
  Super(): ToyLang.Super;
  BooleanLiteral(value: boolean): ToyLang.BooleanLiteral;
  StringLiteral(value: string): ToyLang.StringLiteral;
  NumericLiteral(value: number): ToyLang.NumericLiteral;
  NewExpression(
    callee: ToyLang.MemberExpression,
    args: ToyLang.Arguments
  ): ToyLang.NewExpression;
  UnaryExpression(
    operator: string,
    argument:
      | ToyLang.CallExpression
      | ToyLang.CallMemberExpression
      | ToyLang.UnaryExpression
  ): ToyLang.UnaryExpression;
  ClassDeclaration(
    id: ToyLang.Identifier,
    body: ToyLang.BlockStatement,
    superClass: ToyLang.Identifier | null
  ): ToyLang.ClassDeclaration;
  FunctionStatement(
    name: ToyLang.Identifier,
    body: ToyLang.BlockStatement,
    params: ToyLang.Identifier[] | null
  ): ToyLang.FunctionDeclaration;
}

export const DefaultASTFactory: ASTFactory = {
  Program(body) {
    return { type: "Program", body };
  },
  EmptyStatement() {
    return { type: "EmptyStatement" };
  },
  BlockStatement(body) {
    return {
      type: "BlockStatement",
      body,
    };
  },
  ExpressionStatement(expression) {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },
  IfStatement(test, consequent, alternate) {
    return {
      type: "IfStatement",
      test,
      consequent,
      alternate,
    };
  },
  ReturnStatement(argument) {
    return {
      type: "ReturnStatement",
      argument,
    };
  },
  WhileStatement(test, body) {
    return {
      type: "WhileStatement",
      test,
      body,
    };
  },
  DoWhileStatement(test, body) {
    return {
      type: "DoWhileStatement",
      test,
      body,
    };
  },
  ForStatement(props) {
    return {
      type: "ForStatement",
      test: props.test,
      init: props.init,
      update: props.update,
      body: props.body,
    };
  },
  VariableStatement(declarations) {
    return {
      type: "VariableStatement",
      declarations,
    };
  },
  VariableDeclaration(id, init) {
    return {
      type: "VariableDeclaration",
      id,
      init,
    };
  },
  AssignmentExpression({ operator, left, right }) {
    return {
      type: "AssignmentExpression",
      operator,
      left,
      right,
    };
  },
  BinaryExpression(operator, left, right) {
    return {
      type: "BinaryExpression",
      operator,
      left,
      right,
    };
  },
  LogicalExpression(operator, left, right) {
    return {
      type: "LogicalExpression",
      operator,
      left,
      right,
    };
  },
  Identifier(name) {
    return { type: "Identifier", name };
  },
  NullLiteral() {
    return {
      type: "NullLiteral",
      value: null,
    };
  },
  BooleanLiteral(value) {
    return {
      type: "BooleanLiteral",
      value: value,
    };
  },
  StringLiteral(value) {
    return {
      type: "StringLiteral",
      value: value,
    };
  },
  NumericLiteral(value) {
    return {
      type: "NumericLiteral",
      value,
    };
  },
  NewExpression(callee, args) {
    return {
      type: "NewExpression",
      callee,
      arguments: args,
    };
  },
  UnaryExpression(operator, argument) {
    return {
      type: "UnaryExpression",
      operator,
      argument,
    };
  },
  ThisExpression() {
    return {
      type: "ThisExpression",
    };
  },
  Super() {
    return {
      type: "Super",
    };
  },

  ClassDeclaration(id, body, superClass) {
    return {
      type: "ClassDeclaration",
      superClass,
      id,
      body,
    };
  },
  FunctionStatement(name, body, params) {
    return {
      type: "FunctionDeclaration",
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
