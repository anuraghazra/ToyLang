import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";

export function parseSuper(parser: Parser) {
  parser._eat(TokenTypes.super);

  return parser.factory.Super();
}

export function parseIdentifier(parser: Parser) {
  let name = parser._eat(TokenTypes.IDENTIFIER).value;
  return parser.factory.Identifier(name);
}
