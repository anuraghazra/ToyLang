import { ToyLangParserError } from "../ErrorReporter";
import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";
import { parseExpression } from "./expression";
import { parseStatement } from "./statement";
import { parseVariableStatementInit } from "./variable";

export function parseIterationStatement(parser: Parser) {
  switch (parser.lookahead?.type) {
    case TokenTypes.while:
      return parseWhileStatement(parser);
    case TokenTypes.do:
      return parseDoWhileStatement(parser);
    case TokenTypes.for:
      return parseForStatement(parser);
  }

  throw parser.panic({
    type: "SyntaxError",
    message: ({ got }) => [`invalid IterationStatement: ${got}`],
  });
}

// `while` `(` expression `)` Statement
export function parseWhileStatement(parser: Parser) {
  parser.eat(TokenTypes.while);
  parser.eat(TokenTypes.PAREN_START);
  const test = parseExpression(parser);
  parser.eat(TokenTypes.PAREN_END);
  const body = parseStatement(parser);

  return parser.factory.WhileStatement(test, body);
}

// `do` Statement `while` `(` expression `)`
export function parseDoWhileStatement(parser: Parser) {
  parser.eat(TokenTypes.do);
  const body = parseStatement(parser);
  parser.eat(TokenTypes.while);
  parser.eat(TokenTypes.PAREN_START);
  const test = parseExpression(parser);
  parser.eat(TokenTypes.PAREN_END);
  parser.eat(TokenTypes.SEMI);

  return parser.factory.DoWhileStatement(test, body);
}

// for `(` Statement `;` Statement `;` Statement `)` Statement
export function parseForStatement(parser: Parser) {
  parser.eat(TokenTypes.for);
  parser.eat(TokenTypes.PAREN_START);

  const init =
    parser.lookahead?.type !== TokenTypes.SEMI
      ? parseForStatementInit(parser)
      : null;
  parser.eat(TokenTypes.SEMI);

  const test =
    parser.lookahead?.type !== TokenTypes.SEMI ? parseExpression(parser) : null;
  parser.eat(TokenTypes.SEMI);

  const update =
    parser.lookahead?.type !== TokenTypes.PAREN_END
      ? parseExpression(parser)
      : null;
  parser.eat(TokenTypes.PAREN_END);

  const body = parseStatement(parser);

  return parser.factory.ForStatement({ init, test, update, body });
}

export function parseForStatementInit(parser: Parser) {
  if (parser.lookahead?.type === TokenTypes.let) {
    return parseVariableStatementInit(parser);
  }
  return parseExpression(parser);
}
