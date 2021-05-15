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

    while (this._lookahead !== null && this._lookahead?.type !== stopLookhead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement() {
    switch (this._lookahead?.type) {
      case "let":
        return this.VariableStatement();
      case ";":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  // let VariableDeclarationList ';'
  VariableStatement() {
    this._eat("let");

    const declarations = this.VariableDeclarationList();

    this._eat(";");

    return {
      type: "VariableStatement",
      declarations,
    };
  }

  VariableDeclarationList() {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (this._lookahead?.type === "," && this._eat(","));

    return declarations;
  }

  // Identifier OptVariableInitializer
  VariableDeclaration() {
    const id = this.Identifier();
    const init =
      this._lookahead?.type !== ";" && this._lookahead?.type !== ","
        ? this.VariableInitializer()
        : null;

    return {
      type: "VariableDeclaration",
      id,
      init,
    };
  }

  // SIMPLE_ASSIGNMENT AssignmentExpression
  VariableInitializer() {
    this._eat("SIMPLE_ASSIGNMENT");

    return this.AssignmentExpression();
  }

  EmptyStatement() {
    this._eat(";");
    return factory.EmptyStatement();
  }

  // { OptStatementList }
  BlockStatement() {
    this._eat("{");

    const body = this._lookahead?.type !== "}" ? this.StatementList("}") : [];

    this._eat("}");

    return factory.BlockStatement(body);
  }

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");

    return factory.ExpressionStatement(expression);
  }

  Expression() {
    return this.AssignmentExpression();
  }

  // LefthandSideExpression ASSIGNMENT_OPERATOR AssignmentExpression
  AssignmentExpression() {
    let left = this.AdditiveExpression();

    if (!this._isAssignmentOperator(this._lookahead?.type)) {
      return left;
    }

    return {
      type: "AssignmentExpression",
      operator: this.AssignmentOperator().value,
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  LeftHandSideExpression() {
    return this.Identifier();
  }

  Identifier() {
    let name = this._eat("IDENTIFIER").value;
    return { type: "Identifier", name };
  }

  _checkValidAssignmentTarget(node) {
    if (node.type === "Identifier") {
      return node;
    }
    throw new SyntaxError(
      `Invalid left-hand side in assignment expression, expected "Identifier" but got "${node.type}"`
    );
  }

  AssignmentOperator() {
    if (this._lookahead?.type === "SIMPLE_ASSIGNMENT") {
      return this._eat("SIMPLE_ASSIGNMENT");
    }
    return this._eat("COMPLEX_ASSIGNMENT");
  }

  _isAssignmentOperator(type) {
    return type === "SIMPLE_ASSIGNMENT" || type === "COMPLEX_ASSIGNMENT";
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
    if (this._isLiteral(this._lookahead?.type)) {
      return this.Literal();
    }
    switch (this._lookahead?.type) {
      case "(":
        return this.ParenthesizedExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  _isLiteral(tokenType) {
    return tokenType === "NUMBER" || tokenType === "STRING";
  }

  // ( Expression )
  ParenthesizedExpression() {
    this._eat("(");

    let expression = this.Expression();

    this._eat(")");

    return expression;
  }

  Literal() {
    switch (this._lookahead?.type) {
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
