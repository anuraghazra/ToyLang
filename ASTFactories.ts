import {
  Statement,
  Program,
  ExpressionStatement,
  Expression,
  Identifier,
  AssignmentExpression,
  MemberExpression,
  Arguments,
  NewExpression,
  CallMemberExpression,
  UnaryExpression,
  ThisExpression,
  Super,
  BlockStatement,
  EmptyStatement,
  ForStatement,
  IfStatement,
  VariableDeclaration,
  VariableStatement,
  ClassDeclaration,
  FunctionDeclaration,
  WhileStatement,
  DoWhileStatement,
  ReturnStatement,
  NullLiteral,
  BooleanLiteral,
  StringLiteral,
  NumericLiteral,
  BinaryExpression,
  LogicalExpression,
  CallExpression,
} from "./typings";

export const DefaultASTFactory = {
  Program(body: Statement[]): Program {
    return { type: "Program", body };
  },
  EmptyStatement(): EmptyStatement {
    return { type: "EmptyStatement" };
  },
  BlockStatement(body: Statement[]): BlockStatement {
    return {
      type: "BlockStatement",
      body,
    };
  },
  ExpressionStatement(expression: Expression): ExpressionStatement {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },
  IfStatement(
    test: IfStatement["test"],
    consequent: IfStatement["consequent"],
    alternate: IfStatement["alternate"]
  ): IfStatement {
    return {
      type: "IfStatement",
      test,
      consequent,
      alternate,
    };
  },
  ReturnStatement(argument: Expression | null): ReturnStatement {
    return {
      type: "ReturnStatement",
      argument,
    };
  },
  WhileStatement(test: Expression, body: Statement): WhileStatement {
    return {
      type: "WhileStatement",
      test,
      body,
    };
  },
  DoWhileStatement(test: Expression, body: Statement): DoWhileStatement {
    return {
      type: "DoWhileStatement",
      test,
      body,
    };
  },
  ForStatement(props: {
    test: ForStatement["test"] | null;
    init: ForStatement["init"] | null;
    update: ForStatement["update"] | null;
    body: ForStatement["body"];
  }): {
    type: "ForStatement";
    test: ForStatement["test"] | null;
    init: ForStatement["init"] | null;
    update: ForStatement["update"] | null;
    body: ForStatement["body"];
  } {
    return {
      type: "ForStatement",
      test: props.test,
      init: props.init,
      update: props.update,
      body: props.body,
    };
  },
  VariableStatement(declarations: VariableDeclaration[]): VariableStatement {
    return {
      type: "VariableStatement",
      declarations,
    };
  },
  VariableDeclaration(
    id: Identifier,
    init: VariableDeclaration["init"]
  ): VariableDeclaration {
    return {
      type: "VariableDeclaration",
      id,
      init,
    };
  },
  AssignmentExpression({
    operator,
    left,
    right,
  }: Omit<AssignmentExpression, "type">): AssignmentExpression {
    return {
      type: "AssignmentExpression",
      operator,
      left,
      right,
    };
  },
  BinaryExpression(
    operator: string,
    left: BinaryExpression["left"],
    right: BinaryExpression["right"]
  ): BinaryExpression {
    return {
      type: "BinaryExpression",
      operator,
      left,
      right,
    };
  },
  LogicalExpression(
    operator: string,
    left: LogicalExpression["left"],
    right: LogicalExpression["right"]
  ): LogicalExpression {
    return {
      type: "LogicalExpression",
      operator,
      left,
      right,
    };
  },
  Identifier(name: string): Identifier {
    return { type: "Identifier", name };
  },
  NullLiteral(): NullLiteral {
    return {
      type: "NullLiteral",
      value: null,
    };
  },
  BooleanLiteral(value: boolean): BooleanLiteral {
    return {
      type: "BooleanLiteral",
      value: value,
    };
  },
  StringLiteral(value: string): StringLiteral {
    return {
      type: "StringLiteral",
      value: value,
    };
  },
  NumericLiteral(value: number): NumericLiteral {
    return {
      type: "NumericLiteral",
      value,
    };
  },
  NewExpression(callee: MemberExpression, args: Arguments): NewExpression {
    return {
      type: "NewExpression",
      callee,
      arguments: args,
    };
  },
  UnaryExpression(
    operator: string,
    argument: CallExpression | CallMemberExpression | UnaryExpression
  ): UnaryExpression {
    return {
      type: "UnaryExpression",
      operator,
      argument,
    };
  },
  ThisExpression(): ThisExpression {
    return {
      type: "ThisExpression",
    };
  },
  Super(): Super {
    return {
      type: "Super",
    };
  },

  ClassDeclaration(
    id: Identifier,
    body: BlockStatement,
    superClass: Identifier | null
  ): ClassDeclaration {
    return {
      type: "ClassDeclaration",
      superClass,
      id,
      body,
    };
  },
  FunctionStatement(
    name: Identifier,
    body: BlockStatement,
    params: Identifier[] | null
  ): FunctionDeclaration {
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
