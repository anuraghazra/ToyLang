import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";
import { parseIdentifier } from "./identifiers";
import { parseBlockStatement } from "./statement";

// `class` Identifier `extends` OptExtends: BlockStatement
export function parseClassDeclaration(parser: Parser) {
  parser.eat(TokenTypes.class);

  const id = parseIdentifier(parser);

  const superClass =
    parser.lookahead?.type === TokenTypes.extends
      ? parseClassExtends(parser)
      : null;

  const body = parseBlockStatement(parser);

  return parser.factory.ClassDeclaration(id, body, superClass);
}

export function parseClassExtends(parser: Parser) {
  parser.eat(TokenTypes.extends);

  return parseIdentifier(parser);
}
