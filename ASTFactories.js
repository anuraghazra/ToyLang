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
