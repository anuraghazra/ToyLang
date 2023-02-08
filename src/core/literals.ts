import { ToyLangParserError } from "../ErrorReporter";
import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";
import { tl } from "../typings";

export function isLiteral(tokenType?: TokenTypes) {
  if (!tokenType) {
    return false;
  }
  return [
    TokenTypes.NUMBER,
    TokenTypes.STRING,
    TokenTypes.true,
    TokenTypes.false,
    TokenTypes.null,
  ].includes(tokenType);
}

export function parseLiteral(parser: Parser): tl.Literal {
  switch (parser.lookahead?.type) {
    case TokenTypes.NUMBER:
      return parseNumericLiteral(parser);
    case TokenTypes.STRING:
      return parseStringLiteral(parser);
    case TokenTypes.true:
      return parseBooleanLiteral(parser, true);
    case TokenTypes.false:
      return parseBooleanLiteral(parser, false);
    case TokenTypes.null:
      return parseNullLiteral(parser);
  }

  throw parser.panic({
    type: "SyntaxError",
    message: () => ["Unexpected token"],
  });
}

export function parseNullLiteral(parser: Parser) {
  parser.eat(TokenTypes.null);
  return parser.factory.NullLiteral();
}

export function parseBooleanLiteral(parser: Parser, value: boolean) {
  parser.eat(value ? TokenTypes.true : TokenTypes.false);

  return parser.factory.BooleanLiteral(value);
}

export function parseNumericLiteral(parser: Parser) {
  const token = parser.eat(TokenTypes.NUMBER);

  return parser.factory.NumericLiteral(Number(token.value));
}

export function parseStringLiteral(parser: Parser) {
  const token = parser.eat(TokenTypes.STRING);
  return parser.factory.StringLiteral(token.value.slice(1, -1));
}
