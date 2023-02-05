import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";

export function parseSuper(parser: Parser) {
  parser.eat(TokenTypes.super);

  return parser.factory.Super();
}

export function parseIdentifier(parser: Parser) {
  let name = parser.eat(TokenTypes.IDENTIFIER).value;
  return parser.factory.Identifier(name);
}
