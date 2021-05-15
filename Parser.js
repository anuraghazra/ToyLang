const { DefaultASTFactory } = require("./ASTFactories");
const { Tokenizer } = require("./Tokenizer");

const factory = DefaultASTFactory;

class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    this._string = string;
    this._tokenizer.init(string);

    // prime the tokenizer by obtaining the first token (predictive parsing)
    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  Program() {
    return factory.Program(this.StatementList());
  }

  StatementList(stopLookhead = null) {
    const statementList = [this.Statement()];

    while (this._lookahead !== null && this._lookahead.type !== stopLookhead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement() {
    switch (this._lookahead.type) {
      case ";":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  EmptyStatement() {
    this._eat(";");
    return factory.EmptyStatement();
  }

  // { OptStatementList }
  BlockStatement() {
    this._eat("{");

    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];

    this._eat("}");

    return factory.BlockStatement(body);
  }

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");

    return factory.ExpressionStatement(expression);
  }

  Expression() {
    return this.AdditiveExpression();
  }

  // MultiplicativeExpression ADITITIVE_OPERATOR MultiplicativeExpression
  AdditiveExpression() {
    return this._BinaryExpression(
      "MultiplicativeExpression",
      "ADITITIVE_OPERATOR"
    );
  }

  // PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
  MultiplicativeExpression() {
    return this._BinaryExpression(
      "PrimaryExpression",
      "MULTIPLICATIVE_OPERATOR"
    );
  }

  _BinaryExpression(builderName, tokenType) {
    let left = this[builderName]();

    while (this._lookahead?.type === tokenType) {
      const operator = this._eat(tokenType).value;

      const right = this[builderName]();

      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  PrimaryExpression() {
    switch (this._lookahead.type) {
      case "(":
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }

  // ( Expression )
  ParenthesizedExpression() {
    this._eat("(");

    let expression = this.Expression();

    this._eat(")");

    return expression;
  }

  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }

    throw new SyntaxError("Literal: Unexpected literal");
  }

  NumericLiteral() {
    const token = this._eat("NUMBER");

    return factory.NumericLiteral(Number(token.value));
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return factory.StringLiteral(token.value.slice(1, -1));
  }

  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokenType}"`
      );
    }

    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = { Parser };
