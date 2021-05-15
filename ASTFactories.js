const DefaultASTFactory = {
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
  ForStatement(init, test, update, body) {
    return {
      type: "ForStatement",
      test,
      init,
      update,
      body,
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
};
const SExpressionFactory = {
  Program(body) {
    return ["begin", body];
  },
  EmptyStatement() {},
  BlockStatement(body) {
    return ["begin", body];
  },
  ExpressionStatement(expression) {
    return expression;
  },
  StringLiteral(value) {
    return `${value}`;
  },
  NumericLiteral(value) {
    return value;
  },
};

module.exports = { DefaultASTFactory, SExpressionFactory };
