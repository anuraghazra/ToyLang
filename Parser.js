const { Tokenizer } = require("./Tokenizer");

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
    return { type: "Program", body: this.StatementList() };
  }

  StatementList() {
    this.statementList = [this.Statement()];

    while (this._lookahead !== null) {
      this.statementList.push(this.Statement());
    }

    return this.statementList;
  }

  Statement() {
    return this.ExpressionStatement();
  }

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");

    return {
      type: "ExpressionStatement",
      expression,
    };
  }

  Expression() {
    return this.Literal();
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
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    };
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
