import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";
import { tl } from "../typings";
import { parseClassDeclaration } from "./class";
import { parseAssignmentExpression, parseExpression } from "./expression";
import { parseIdentifier } from "./identifiers";
import { parseIterationStatement } from "./iterations";
import { parseVariableStatement } from "./variable";

export function parseStatement(parser: Parser): tl.Statement {
  switch (parser.lookahead?.type) {
    case TokenTypes.let:
      return parseVariableStatement(parser);
    case TokenTypes.if:
      return parseIfStatement(parser);
    case TokenTypes.do:
    case TokenTypes.while:
    case TokenTypes.for:
      return parseIterationStatement(parser);
    case TokenTypes.def:
      return parseFunctionStatement(parser);
    case TokenTypes.return:
      return parseReturnStatement(parser);
    case TokenTypes.class:
      return parseClassDeclaration(parser);
    case TokenTypes.SEMI:
      return parseEmptyStatement(parser);
    case TokenTypes.CURLY_START:
      return parseBlockStatement(parser);
    default:
      return parseExpressionStatement(parser);
  }
}

export function parseExpressionStatement(parser: Parser) {
  const expression = parseExpression(parser);
  parser.eat(TokenTypes.SEMI);

  return parser.factory.ExpressionStatement(expression);
}

export function parseBlockStatement(parser: Parser) {
  // { OptStatementList }
  parser.eat(TokenTypes.CURLY_START);

  const body =
    parser.lookahead?.type !== TokenTypes.CURLY_END
      ? parseStatementList(parser, TokenTypes.CURLY_END)
      : [];

  parser.eat(TokenTypes.CURLY_END);

  return parser.factory.BlockStatement(body);
}

// `def` Identifier `(` OptFunctionArguments `)` BlockStatement
export function parseFunctionStatement(parser: Parser) {
  parser.eat(TokenTypes.def);
  const name = parseIdentifier(parser);
  parser.eat(TokenTypes.PAREN_START);

  const params =
    parser.lookahead?.type === TokenTypes.PAREN_END
      ? []
      : parseFunctionArguments(parser);

  parser.eat(TokenTypes.PAREN_END);

  const body = parseBlockStatement(parser);

  return parser.factory.FunctionStatement(name, body, params);
}

export function parseStatementList(parser: Parser, stopLookhead?: TokenTypes) {
  const statementList = [parseStatement(parser)];

  while (parser.lookahead !== null && parser.lookahead?.type !== stopLookhead) {
    statementList.push(parseStatement(parser));
  }

  return statementList;
}

// `if` `(` Expression `)` Statement
// `if` `(` Expression `)` Statement `else` Statement
export function parseIfStatement(parser: Parser) {
  parser.eat(TokenTypes.if);
  parser.eat(TokenTypes.PAREN_START);
  const expression = parseExpression(parser);
  parser.eat(TokenTypes.PAREN_END);
  const statement = parseStatement(parser);

  let alternate = null;
  if (parser.lookahead?.type === TokenTypes.else) {
    parser.eat(TokenTypes.else);
    alternate = parseStatement(parser);
  }

  return parser.factory.IfStatement(expression, statement, alternate);
}

// `(` OptArgumentList `)`
export function parseArguments(parser: Parser) {
  parser.eat(TokenTypes.PAREN_START);

  const argumentList =
    parser.lookahead?.type === TokenTypes.PAREN_END
      ? []
      : parseArgumentList(parser);

  parser.eat(TokenTypes.PAREN_END);

  return argumentList;
}

// Expression, Expression
export function parseArgumentList(parser: Parser) {
  const argumentList = [];

  do {
    argumentList.push(parseAssignmentExpression(parser));
  } while (
    parser.lookahead?.type === TokenTypes.COMMA &&
    parser.eat(TokenTypes.COMMA)
  );

  return argumentList;
}

export function parseFunctionArguments(parser: Parser) {
  const params = [];

  do {
    params.push(parseIdentifier(parser));
  } while (
    parser.lookahead?.type === TokenTypes.COMMA &&
    parser.eat(TokenTypes.COMMA)
  );

  return params;
}

export function parseReturnStatement(parser: Parser) {
  parser.eat(TokenTypes.return);

  const argument =
    parser.lookahead?.type === TokenTypes.SEMI ? null : parseExpression(parser);
  parser.eat(TokenTypes.SEMI);

  return parser.factory.ReturnStatement(argument);
}

export function parseEmptyStatement(parser: Parser) {
  parser.eat(TokenTypes.SEMI);
  return parser.factory.EmptyStatement();
}
