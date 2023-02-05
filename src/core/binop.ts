import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";
import { tl } from "../typings";
import { parseUnaryExpression } from "./expression";

export function parseEqualityExpression(parser: Parser) {
  return parse_BinaryExpression(
    parser,
    parseRelationalExpression,
    TokenTypes.EQUALITY_OPERATOR
  );
}

// RelationalExpression
// AdditiveExpression RELATIONAL_OPERATOR
export function parseRelationalExpression(parser: Parser) {
  return parse_BinaryExpression(
    parser,
    parseAdditiveExpression,
    TokenTypes.RELATIONAL_OPERATOR
  );
}

// MultiplicativeExpression ADDITITIVE_OPERATOR MultiplicativeExpression
export function parseAdditiveExpression(parser: Parser) {
  return parse_BinaryExpression(
    parser,
    parseMultiplicativeExpression,
    TokenTypes.ADDITITIVE_OPERATOR
  );
}

// UnaryExpression MULTIPLICATIVE_OPERATOR UnaryExpression
export function parseMultiplicativeExpression(parser: Parser) {
  return parse_BinaryExpression(
    parser,
    parseUnaryExpression,
    TokenTypes.MULTIPLICATIVE_OPERATOR
  );
}

export function parseLogicalANDExpression(parser: Parser) {
  return parse_LogicalExpression(
    parser,
    parseEqualityExpression,
    TokenTypes.LOGICAL_AND
  );
}

export function parseLogicalORExpression(parser: Parser) {
  return parse_LogicalExpression(
    parser,
    parseLogicalANDExpression,
    TokenTypes.LOGICAL_OR
  );
}

export function parse_BinaryExpression<T extends Function>(
  parser: Parser,
  builder: T,
  tokenType: TokenTypes
): tl.BinaryExpression {
  let left = builder(parser);

  while (parser.lookahead?.type === tokenType) {
    const operator = parser.eat(tokenType).value;

    const right = builder(parser);

    left = parser.factory.BinaryExpression(operator, left, right);
  }

  return left;
}

export function parse_LogicalExpression<T extends Function>(
  parser: Parser,
  builder: T,
  tokenType: TokenTypes
): tl.LogicalExpression {
  let left = builder(parser);

  while (parser.lookahead?.type === tokenType) {
    const operator = parser.eat(tokenType).value;

    const right = builder(parser);

    left = parser.factory.LogicalExpression(operator, left, right);
  }

  return left;
}
