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
      case "if":
        return this.IfStatement();
      case "do":
      case "while":
      case "for":
        return this.IterationStatement();
      case "def":
        return this.FunctionStatement();
      case "return":
        return this.ReturnStatement();
      case "class":
        return this.ClassDeclaration();
      case ";":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  // `class` Identifier `extends` OptExtends: BlockStatement
  ClassDeclaration() {
    this._eat("class");

    const id = this.Identifier();

    const superClass =
      this._lookahead?.type === "extends" ? this.ClassExtends() : null;

    const body = this.BlockStatement();

    return {
      type: "ClassDeclaration",
      superClass,
      id,
      body,
    };
  }

  ClassExtends() {
    this._eat("extends");

    return this.Identifier();
  }

  // `def` Identifier `(` OptFunctionArguments `)` BlockStatement
  FunctionStatement() {
    this._eat("def");
    const name = this.Identifier();
    this._eat("(");

    const params =
      this._lookahead?.type === ")" ? [] : this.FunctionArguments();
    this._eat(")");

    const body = this.BlockStatement();

    return {
      type: "FunctionDeclaration",
      name,
      body,
      params,
    };
  }

  FunctionArguments() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this._lookahead?.type === "," && this._eat(","));

    return params;
  }

  ReturnStatement() {
    this._eat("return");

    const argument = this._lookahead?.type === ";" ? null : this.Expression();
    this._eat(";");

    return {
      type: "ReturnStatement",
      argument,
    };
  }

  IterationStatement() {
    switch (this._lookahead?.type) {
      case "while":
        return this.WhileStatement();
      case "do":
        return this.DoWhileStatement();
      case "for":
        return this.ForStatement();
    }
  }

  // `while` `(` expression `)` Statement
  WhileStatement() {
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    const body = this.Statement();

    return factory.WhileStatement(test, body);
  }

  // `do` Statement `while` `(` expression `)`
  DoWhileStatement() {
    this._eat("do");
    const body = this.Statement();
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    this._eat(";");

    return factory.DoWhileStatement(test, body);
  }

  // for `(` Statement `;` Statement `;` Statement `)` Statement
  ForStatement() {
    this._eat("for");
    this._eat("(");

    const init = this._lookahead?.type !== ";" ? this.ForStatementInit() : null;
    this._eat(";");

    const test = this._lookahead?.type !== ";" ? this.Expression() : null;
    this._eat(";");

    const update = this._lookahead?.type !== ")" ? this.Expression() : null;
    this._eat(")");

    const body = this.Statement();

    return factory.ForStatement(init, test, update, body);
  }

  ForStatementInit() {
    if (this._lookahead?.type === "let") {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  // `if` `(` Expression `)` Statement
  // `if` `(` Expression `)` Statement `else` Statement
  IfStatement() {
    this._eat("if");
    this._eat("(");
    const expression = this.Expression();
    this._eat(")");
    const statement = this.Statement();

    let alternate = null;
    if (this._lookahead?.type === "else") {
      this._eat("else");
      alternate = this.Statement();
    }

    return factory.IfStatement(expression, statement, alternate);
  }

  // let VariableDeclarationList
  VariableStatementInit() {
    this._eat("let");
    const declarations = this.VariableDeclarationList();
    return factory.VariableStatement(declarations);
  }

  // let VariableDeclarationList ';'
  VariableStatement() {
    const varStatement = this.VariableStatementInit();
    this._eat(";");
    return varStatement;
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

    return factory.VariableDeclaration(id, init);
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

  Identifier() {
    let name = this._eat("IDENTIFIER").value;
    return factory.Identifier(name);
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
    let left = this.LogicalORExpression();

    if (!this._isAssignmentOperator(this._lookahead?.type)) {
      return left;
    }

    return factory.AssignmentExpression({
      operator: this.AssignmentOperator().value,
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    });
  }

  UnaryExpression() {
    let operator;

    switch (this._lookahead?.type) {
      case "ADDITITIVE_OPERATOR":
        operator = this._eat("ADDITITIVE_OPERATOR").value;
        break;
      case "LOGICAL_NOT":
        operator = this._eat("LOGICAL_NOT").value;
        break;
    }

    if (operator) {
      return {
        type: "UnaryExpression",
        operator,
        argument: this.UnaryExpression(),
      };
    }

    return this.LeftHandSideExpression();
  }

  LeftHandSideExpression() {
    return this.CallMemberExpression();
  }

  // | MemberExpression
  // | CallExpression
  CallMemberExpression() {
    if (this._lookahead?.type === "super") {
      return this._CallExpression(this.Super());
    }

    const member = this.MemberExpression();

    if (this._lookahead?.type === "(") {
      return this._CallExpression(member);
    }

    return member;
  }

  _CallExpression(callee) {
    let callExpression = {
      type: "CallExpression",
      callee,
      arguments: this.Arguments(),
    };

    if (this._lookahead?.type === "(") {
      callExpression = this._CallExpression(callExpression);
    }

    return callExpression;
  }

  // `(` OptArgumentList `)`
  Arguments() {
    this._eat("(");

    const argumentList =
      this._lookahead?.type === ")" ? [] : this.ArgumentList();

    this._eat(")");

    return argumentList;
  }

  // Expression, Expression
  ArgumentList() {
    const argumentList = [];

    do {
      argumentList.push(this.AssignmentExpression());
    } while (this._lookahead?.type === "," && this._eat(","));

    return argumentList;
  }

  // PrimaryExpression
  // MemberExpression `.` Identifier
  // MemberExpression `[` Expression `]`
  MemberExpression() {
    let object = this.PrimaryExpression();

    while (this._lookahead?.type === "." || this._lookahead?.type === "[") {
      if (this._lookahead?.type === ".") {
        this._eat(".");
        const property = this.Identifier();
        object = {
          type: "MemberExpression",
          computed: false,
          object,
          property,
        };
      }
      if (this._lookahead?.type === "[") {
        this._eat("[");
        const property = this.Expression();
        this._eat("]");
        object = {
          type: "MemberExpression",
          computed: true,
          object,
          property,
        };
      }
    }

    return object;
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
    this._eat("new");

    return {
      type: "NewExpression",
      callee: this.MemberExpression(),
      arguments: this.Arguments(),
    };
  }

  ThisExpression() {
    this._eat("this");
    return {
      type: "ThisExpression",
    };
  }

  Super() {
    this._eat("super");

    return {
      type: "Super",
    };
  }

  // ( Expression )
  ParenthesizedExpression() {
    this._eat("(");
    const expression = this.Expression();
    this._eat(")");

    return expression;
  }

  _checkValidAssignmentTarget(node) {
    if (node.type === "Identifier" || node.type === "MemberExpression") {
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

  EqualityExpression() {
    return this._BinaryExpression("RelationalExpression", "EQUALITY_OPERATOR");
  }

  // RelationalExpression
  // AdditiveExpression RELATIONAL_OPERATOR
  RelationalExpression() {
    return this._BinaryExpression("AdditiveExpression", "RELATIONAL_OPERATOR");
  }

  // MultiplicativeExpression ADDITITIVE_OPERATOR MultiplicativeExpression
  AdditiveExpression() {
    return this._BinaryExpression(
      "MultiplicativeExpression",
      "ADDITITIVE_OPERATOR"
    );
  }

  // UnaryExpression MULTIPLICATIVE_OPERATOR UnaryExpression
  MultiplicativeExpression() {
    return this._BinaryExpression("UnaryExpression", "MULTIPLICATIVE_OPERATOR");
  }

  LogicalANDExpression() {
    return this._LogicalExpression("EqualityExpression", "LOGICAL_AND");
  }

  LogicalORExpression() {
    return this._LogicalExpression("LogicalANDExpression", "LOGICAL_OR");
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

  _LogicalExpression(builderName, tokenType) {
    let left = this[builderName]();

    while (this._lookahead?.type === tokenType) {
      const operator = this._eat(tokenType).value;

      const right = this[builderName]();

      left = {
        type: "LogicalExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  // ----------------- Literals
  _isLiteral(tokenType) {
    return ["NUMBER", "STRING", "true", "false", "null"].includes(tokenType);
  }

  Literal() {
    switch (this._lookahead?.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      case "true":
        return this.BooleanLiteral(true);
      case "false":
        return this.BooleanLiteral(false);
      case "null":
        return this.NullLiteral(false);
    }

    throw new SyntaxError("Literal: Unexpected literal");
  }

  NullLiteral() {
    this._eat("null");
    return factory.NullLiteral();
  }

  BooleanLiteral(value) {
    this._eat(value ? "true" : "false");

    return factory.BooleanLiteral(value);
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
