import { Parser } from "../Parser";
import { Token, TokenTypes } from "../Tokenizer";
import { tl } from "../typings";
import { parseAssignmentExpression } from "./expression";
import { parseIdentifier } from "./identifiers";

// let VariableDeclarationList
export function parseVariableStatementInit(parser: Parser) {
  parser._eat(TokenTypes.let);
  const declarations = parseVariableDeclarationList(parser);
  return parser.factory.VariableStatement(declarations);
}

// let VariableDeclarationList ';'
export function parseVariableStatement(parser: Parser) {
  const varStatement = parseVariableStatementInit(parser);
  parser._eat(TokenTypes.SEMI);
  return varStatement;
}

export function parseVariableDeclarationList(parser: Parser) {
  const declarations = [];

  do {
    declarations.push(parseVariableDeclaration(parser));
  } while (
    parser._lookahead?.type === TokenTypes.COMMA &&
    parser._eat(TokenTypes.COMMA)
  );

  return declarations;
}

// Identifier OptVariableInitializer
export function parseVariableDeclaration(parser: Parser) {
  const id = parseIdentifier(parser);
  let typeAnnotation = null;
  if (parser._lookahead?.type === TokenTypes.COLON) {
    parser._eat(TokenTypes.COLON);
    // @ts-ignore
    if (parser._lookahead?.type === TokenTypes.TYPE_KINDS) {
      typeAnnotation = parser._lookahead?.value as tl.TypeKind;
      parser._eat(TokenTypes.TYPE_KINDS);
    }
  }

  const init =
    parser._lookahead?.type !== TokenTypes.SEMI &&
    parser._lookahead?.type !== TokenTypes.COMMA
      ? parseVariableInitializer(parser)
      : null;

  return parser.factory.VariableDeclaration(id, init, typeAnnotation);
}

// SIMPLE_ASSIGNMENT AssignmentExpression
export function parseVariableInitializer(parser: Parser) {
  parser._eat(TokenTypes.SIMPLE_ASSIGNMENT);

  return parseAssignmentExpression(parser);
}
