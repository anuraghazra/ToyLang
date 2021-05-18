import {
  AssignmentOperators,
  BinaryExpression,
  CallExpression,
  CallMemberExpression,
  Expression,
  Literal,
  LogicalExpression,
  MemberExpression,
  Statement,
  Super,
  UnaryExpression,
} from "./typings";
import { Token, Tokenizer, TokenTypes } from "./Tokenizer";
import { DefaultASTFactory } from "./ASTFactories";

const factory = DefaultASTFactory;

export class Parser {
  _string: string;
  _tokenizer: Tokenizer;
  _lookahead!: Token | null;
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string: string) {
    this._string = string;
    this._tokenizer.init(string);

    // prime the tokenizer by obtaining the first token (predictive parsing)
    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  Program() {
    return factory.Program(this.StatementList());
  }

  StatementList(stopLookhead?: TokenTypes) {
    const statementList = [this.Statement()];

    while (this._lookahead !== null && this._lookahead?.type !== stopLookhead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement(): Statement {
    switch (this._lookahead?.type) {
      case TokenTypes.let:
        return this.VariableStatement();
      case TokenTypes.if:
        return this.IfStatement();
      case TokenTypes.do:
      case TokenTypes.while:
      case TokenTypes.for:
        return this.IterationStatement();
      case TokenTypes.def:
        return this.FunctionStatement();
      case TokenTypes.return:
        return this.ReturnStatement();
      case TokenTypes.class:
        return this.ClassDeclaration();
      case TokenTypes[";"]:
        return this.EmptyStatement();
      case TokenTypes["{"]:
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  // `class` Identifier `extends` OptExtends: BlockStatement
  ClassDeclaration() {
    this._eat(TokenTypes.class);

    const id = this.Identifier();

    const superClass =
      this._lookahead?.type === TokenTypes.extends ? this.ClassExtends() : null;

    const body = this.BlockStatement();

    return factory.ClassDeclaration(id, body, superClass);
  }

  ClassExtends() {
    this._eat(TokenTypes.extends);

    return this.Identifier();
  }

  // `def` Identifier `(` OptFunctionArguments `)` BlockStatement
  FunctionStatement() {
    this._eat(TokenTypes.def);
    const name = this.Identifier();
    this._eat(TokenTypes["("]);

    const params =
      this._lookahead?.type === TokenTypes[")"] ? [] : this.FunctionArguments();
    this._eat(TokenTypes[")"]);

    const body = this.BlockStatement();

    return factory.FunctionStatement(name, body, params);
  }

  FunctionArguments() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (
      this._lookahead?.type === TokenTypes[","] &&
      this._eat(TokenTypes[","])
    );

    return params;
  }

  ReturnStatement() {
    this._eat(TokenTypes.return);

    const argument =
      this._lookahead?.type === TokenTypes[";"] ? null : this.Expression();
    this._eat(TokenTypes[";"]);

    return factory.ReturnStatement(argument);
  }

  IterationStatement() {
    switch (this._lookahead?.type) {
      case TokenTypes.while:
        return this.WhileStatement();
      case TokenTypes.do:
        return this.DoWhileStatement();
      case TokenTypes.for:
        return this.ForStatement();
    }
    throw new SyntaxError(
      `invalid IterationStatement: ${this._lookahead?.type}`
    );
  }

  // `while` `(` expression `)` Statement
  WhileStatement() {
    this._eat(TokenTypes.while);
    this._eat(TokenTypes["("]);
    const test = this.Expression();
    this._eat(TokenTypes[")"]);
    const body = this.Statement();

    return factory.WhileStatement(test, body);
  }

  // `do` Statement `while` `(` expression `)`
  DoWhileStatement() {
    this._eat(TokenTypes.do);
    const body = this.Statement();
    this._eat(TokenTypes.while);
    this._eat(TokenTypes["("]);
    const test = this.Expression();
    this._eat(TokenTypes[")"]);
    this._eat(TokenTypes[";"]);

    return factory.DoWhileStatement(test, body);
  }

  // for `(` Statement `;` Statement `;` Statement `)` Statement
  ForStatement() {
    this._eat(TokenTypes.for);
    this._eat(TokenTypes["("]);

    const init =
      this._lookahead?.type !== TokenTypes[";"]
        ? this.ForStatementInit()
        : null;
    this._eat(TokenTypes[";"]);

    const test =
      this._lookahead?.type !== TokenTypes[";"] ? this.Expression() : null;
    this._eat(TokenTypes[";"]);

    const update =
      this._lookahead?.type !== TokenTypes[")"] ? this.Expression() : null;
    this._eat(TokenTypes[")"]);

    const body = this.Statement();

    return factory.ForStatement({ init, test, update, body });
  }

  ForStatementInit() {
    if (this._lookahead?.type === TokenTypes.let) {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  // `if` `(` Expression `)` Statement
  // `if` `(` Expression `)` Statement `else` Statement
  IfStatement() {
    this._eat(TokenTypes.if);
    this._eat(TokenTypes["("]);
    const expression = this.Expression();
    this._eat(TokenTypes[")"]);
    const statement = this.Statement();

    let alternate = null;
    if (this._lookahead?.type === TokenTypes.else) {
      this._eat(TokenTypes.else);
      alternate = this.Statement();
    }

    return factory.IfStatement(expression, statement, alternate);
  }

  // let VariableDeclarationList
  VariableStatementInit() {
    this._eat(TokenTypes.let);
    const declarations = this.VariableDeclarationList();
    return factory.VariableStatement(declarations);
  }

  // let VariableDeclarationList ';'
  VariableStatement() {
    const varStatement = this.VariableStatementInit();
    this._eat(TokenTypes[";"]);
    return varStatement;
  }

  VariableDeclarationList() {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (
      this._lookahead?.type === TokenTypes[","] &&
      this._eat(TokenTypes[","])
    );

    return declarations;
  }

  // Identifier OptVariableInitializer
  VariableDeclaration() {
    const id = this.Identifier();
    const init =
      this._lookahead?.type !== TokenTypes[";"] &&
      this._lookahead?.type !== TokenTypes[","]
        ? this.VariableInitializer()
        : null;

    return factory.VariableDeclaration(id, init);
  }

  // SIMPLE_ASSIGNMENT AssignmentExpression
  VariableInitializer() {
    this._eat(TokenTypes.SIMPLE_ASSIGNMENT);

    return this.AssignmentExpression();
  }

  EmptyStatement() {
    this._eat(TokenTypes[";"]);
    return factory.EmptyStatement();
  }

  Identifier() {
    let name = this._eat(TokenTypes.IDENTIFIER).value;
    return factory.Identifier(name);
  }

  // { OptStatementList }
  BlockStatement() {
    this._eat(TokenTypes["{"]);

    const body =
      this._lookahead?.type !== TokenTypes["}"]
        ? this.StatementList(TokenTypes["}"])
        : [];

    this._eat(TokenTypes["}"]);

    return factory.BlockStatement(body);
  }

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(TokenTypes[";"]);

    return factory.ExpressionStatement(expression);
  }

  Expression() {
    return this.AssignmentExpression();
  }

  // LefthandSideExpression ASSIGNMENT_OPERATOR AssignmentExpression
  AssignmentExpression(): Expression {
    let left = this.LogicalORExpression();

    if (!this._isAssignmentOperator(this._lookahead?.type)) {
      return left;
    }

    return factory.AssignmentExpression({
      operator: this.AssignmentOperator().value as AssignmentOperators,
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    });
  }

  UnaryExpression(): CallExpression | CallMemberExpression | UnaryExpression {
    let operator;

    switch (this._lookahead?.type) {
      case TokenTypes.ADDITITIVE_OPERATOR:
        operator = this._eat(TokenTypes.ADDITITIVE_OPERATOR).value;
        break;
      case TokenTypes.LOGICAL_NOT:
        operator = this._eat(TokenTypes.LOGICAL_NOT).value;
        break;
    }

    if (operator) {
      return factory.UnaryExpression(operator, this.UnaryExpression());
    }

    return this.LeftHandSideExpression();
  }

  LeftHandSideExpression() {
    return this.CallMemberExpression();
  }

  // | MemberExpression
  // | CallExpression
  CallMemberExpression() {
    if (this._lookahead?.type === TokenTypes.super) {
      return this._CallExpression(this.Super());
    }

    const member = this.MemberExpression();

    if (this._lookahead?.type === TokenTypes["("]) {
      return this._CallExpression(member);
    }

    return member;
  }

  _CallExpression(callee: CallMemberExpression | Super) {
    let callExpression = {
      type: "CallExpression",
      callee,
      arguments: this.Arguments(),
    } as CallExpression;

    if (this._lookahead?.type === TokenTypes["("]) {
      callExpression = this._CallExpression(callExpression);
    }

    return callExpression;
  }

  // `(` OptArgumentList `)`
  Arguments() {
    this._eat(TokenTypes["("]);

    const argumentList =
      this._lookahead?.type === TokenTypes[")"] ? [] : this.ArgumentList();

    this._eat(TokenTypes[")"]);

    return argumentList;
  }

  // Expression, Expression
  ArgumentList() {
    const argumentList = [];

    do {
      argumentList.push(this.AssignmentExpression());
    } while (
      this._lookahead?.type === TokenTypes[","] &&
      this._eat(TokenTypes[","])
    );

    return argumentList;
  }

  // PrimaryExpression
  // MemberExpression `.` Identifier
  // MemberExpression `[` Expression `]`
  MemberExpression(): MemberExpression {
    let object = this.PrimaryExpression();

    while (
      this._lookahead?.type === TokenTypes["."] ||
      this._lookahead?.type === TokenTypes["["]
    ) {
      if (this._lookahead?.type === TokenTypes["."]) {
        this._eat(TokenTypes["."]);
        const property = this.Identifier();
        object = {
          type: "MemberExpression",
          computed: false,
          object,
          property,
        } as MemberExpression;
      }
      if (this._lookahead?.type === TokenTypes["["]) {
        this._eat(TokenTypes["["]);
        const property = this.Expression();
        this._eat(TokenTypes["]"]);
        object = {
          type: "MemberExpression",
          computed: true,
          object,
          property,
        } as MemberExpression;
      }
    }

    return object as MemberExpression;
  }

  PrimaryExpression() {
    if (this._isLiteral(this._lookahead?.type)) {
      return this.Literal();
    }
    switch (this._lookahead?.type) {
      case "(":
        return this.ParenthesizedExpression();
      case "IDENTIFIER":
        return this.Identifier();
      case "this":
        return this.ThisExpression();
      case "new":
        return this.NewExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  NewExpression() {
    this._eat(TokenTypes.new);

    return factory.NewExpression(this.MemberExpression(), this.Arguments());
  }

  ThisExpression() {
    this._eat(TokenTypes.this);
    return factory.ThisExpression();
  }

  Super() {
    this._eat(TokenTypes.super);

    return factory.Super();
  }

  // ( Expression )
  ParenthesizedExpression() {
    this._eat(TokenTypes["("]);
    const expression = this.Expression();
    this._eat(TokenTypes[")"]);

    return expression;
  }

  _checkValidAssignmentTarget<T extends BinaryExpression["left"]>(node: T) {
    if (node.type === "Identifier" || node.type === "MemberExpression") {
      return node;
    }
    throw new SyntaxError(
      `Invalid left-hand side in assignment expression, expected "Identifier" but got "${node.type}"`
    );
  }

  AssignmentOperator() {
    if (this._lookahead?.type === TokenTypes.SIMPLE_ASSIGNMENT) {
      return this._eat(TokenTypes.SIMPLE_ASSIGNMENT);
    }
    return this._eat(TokenTypes.COMPLEX_ASSIGNMENT);
  }

  _isAssignmentOperator(type?: TokenTypes) {
    return (
      type === TokenTypes.SIMPLE_ASSIGNMENT ||
      type === TokenTypes.COMPLEX_ASSIGNMENT
    );
  }

  EqualityExpression() {
    return this._BinaryExpression(
      this.RelationalExpression.bind(this),
      TokenTypes.EQUALITY_OPERATOR
    );
  }

  // RelationalExpression
  // AdditiveExpression RELATIONAL_OPERATOR
  RelationalExpression() {
    return this._BinaryExpression(
      this.AdditiveExpression.bind(this),
      TokenTypes.RELATIONAL_OPERATOR
    );
  }

  // MultiplicativeExpression ADDITITIVE_OPERATOR MultiplicativeExpression
  AdditiveExpression() {
    return this._BinaryExpression(
      this.MultiplicativeExpression.bind(this),
      TokenTypes.ADDITITIVE_OPERATOR
    );
  }

  // UnaryExpression MULTIPLICATIVE_OPERATOR UnaryExpression
  MultiplicativeExpression() {
    return this._BinaryExpression(
      this.UnaryExpression.bind(this),
      TokenTypes.MULTIPLICATIVE_OPERATOR
    );
  }

  LogicalANDExpression() {
    return this._LogicalExpression(
      this.EqualityExpression.bind(this),
      TokenTypes.LOGICAL_AND
    );
  }

  LogicalORExpression() {
    return this._LogicalExpression(
      this.LogicalANDExpression.bind(this),
      TokenTypes.LOGICAL_OR
    );
  }

  _BinaryExpression<T extends Function>(
    builder: T,
    tokenType: TokenTypes
  ): BinaryExpression {
    let left = builder();

    while (this._lookahead?.type === tokenType) {
      const operator = this._eat(tokenType).value;

      const right = builder();

      left = factory.BinaryExpression(operator, left, right);
    }

    return left;
  }

  _LogicalExpression<T extends Function>(
    builder: T,
    tokenType: TokenTypes
  ): LogicalExpression {
    let left = builder();

    while (this._lookahead?.type === tokenType) {
      const operator = this._eat(tokenType).value;

      const right = builder();

      left = factory.LogicalExpression(operator, left, right);
    }

    return left;
  }

  // ----------------- Literals
  _isLiteral(tokenType?: TokenTypes) {
    if (!tokenType) throw Error("No token type provided");
    return [
      TokenTypes.NUMBER,
      TokenTypes.STRING,
      TokenTypes.true,
      TokenTypes.false,
      TokenTypes.null,
    ].includes(tokenType);
  }

  Literal(): Literal {
    switch (this._lookahead?.type) {
      case TokenTypes.NUMBER:
        return this.NumericLiteral();
      case TokenTypes.STRING:
        return this.StringLiteral();
      case TokenTypes.true:
        return this.BooleanLiteral(true);
      case TokenTypes.false:
        return this.BooleanLiteral(false);
      case TokenTypes.null:
        return this.NullLiteral();
    }

    throw new SyntaxError("Literal: Unexpected literal");
  }

  NullLiteral() {
    this._eat(TokenTypes.null);
    return factory.NullLiteral();
  }

  BooleanLiteral(value: boolean) {
    this._eat(value ? "true" : "false");

    return factory.BooleanLiteral(value);
  }

  NumericLiteral() {
    const token = this._eat(TokenTypes.NUMBER);

    return factory.NumericLiteral(Number(token.value));
  }

  StringLiteral() {
    const token = this._eat(TokenTypes.STRING);
    return factory.StringLiteral(token.value.slice(1, -1));
  }

  _eat(tokenType: keyof typeof TokenTypes) {
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
