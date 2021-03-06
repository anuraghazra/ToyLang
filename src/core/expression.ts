import { Parser } from "../Parser";
import { TokenTypes } from "../Tokenizer";
import { tl } from "../typings";
import { parseLogicalORExpression } from "./binop";
import { parseIdentifier, parseSuper } from "./identifiers";
import { isLiteral, parseLiteral } from "./literals";
import { parseArguments } from "./statement";

export function parseExpression(parser: Parser) {
  return parseAssignmentExpression(parser);
}

export function parsePrimaryExpression(parser: Parser) {
  if (isLiteral(parser._lookahead?.type)) {
    return parseLiteral(parser);
  }
  switch (parser._lookahead?.type) {
    case TokenTypes.PAREN_START:
      return parseParenthesizedExpression(parser);
    case TokenTypes.IDENTIFIER:
      return parseIdentifier(parser);
    case TokenTypes.this:
      return parseThisExpression(parser);
    case TokenTypes.new:
      return parseNewExpression(parser);
    default:
      return parseLeftHandSideExpression(parser);
  }
}

// LefthandSideExpression ASSIGNMENT_OPERATOR AssignmentExpression
export function parseAssignmentExpression(parser: Parser): tl.Expression {
  let left = parseLogicalORExpression(parser);

  if (!isAssignmentOperator(parser._lookahead?.type)) {
    return left;
  }

  return parser.factory.AssignmentExpression({
    operator: parseAssignmentOperator(parser).value as tl.AssignmentOperators,
    left: checkValidAssignmentTarget(left),
    right: parseAssignmentExpression(parser),
  });
}

export function parseAssignmentOperator(parser: Parser) {
  if (parser._lookahead?.type === TokenTypes.SIMPLE_ASSIGNMENT) {
    return parser._eat(TokenTypes.SIMPLE_ASSIGNMENT);
  }
  return parser._eat(TokenTypes.COMPLEX_ASSIGNMENT);
}

export function checkValidAssignmentTarget<
  T extends tl.BinaryExpression["left"]
>(node: T) {
  if (
    node.type === tl.SyntaxKind.Identifier ||
    node.type === tl.SyntaxKind.MemberExpression
  ) {
    return node;
  }
  throw new SyntaxError(
    `Invalid left-hand side in assignment expression, expected "Identifier" but got "${node.type}"`
  );
}

export function isAssignmentOperator(type?: TokenTypes) {
  return (
    type === TokenTypes.SIMPLE_ASSIGNMENT ||
    type === TokenTypes.COMPLEX_ASSIGNMENT
  );
}

export function parseUnaryExpression(
  parser: Parser
): tl.CallExpression | tl.CallMemberExpression | tl.UnaryExpression {
  let operator;

  switch (parser._lookahead?.type) {
    case TokenTypes.ADDITITIVE_OPERATOR:
      operator = parser._eat(TokenTypes.ADDITITIVE_OPERATOR).value;
      break;
    case TokenTypes.LOGICAL_NOT:
      operator = parser._eat(TokenTypes.LOGICAL_NOT).value;
      break;
  }

  if (operator) {
    return parser.factory.UnaryExpression(
      operator,
      parseUnaryExpression(parser)
    );
  }

  return parseLeftHandSideExpression(parser);
}

export function parseLeftHandSideExpression(parser: Parser) {
  return parseCallMemberExpression(parser);
}

// | MemberExpression
// | CallExpression
export function parseCallMemberExpression(parser: Parser) {
  if (parser._lookahead?.type === TokenTypes.super) {
    return parseCallExpression(parser, parseSuper(parser));
  }

  const member = parseMemberExpression(parser);

  if (parser._lookahead?.type === TokenTypes.PAREN_START) {
    return parseCallExpression(parser, member);
  }

  return member;
}

export function parseCallExpression(
  parser: Parser,
  callee: tl.CallMemberExpression | tl.Super
) {
  let callExpression = {
    type: tl.SyntaxKind.CallExpression,
    callee,
    arguments: parseArguments(parser),
  } as tl.CallExpression;

  if (parser._lookahead?.type === TokenTypes.PAREN_START) {
    callExpression = parseCallExpression(parser, callExpression);
  }

  return callExpression;
}

// PrimaryExpression
// MemberExpression `.` Identifier
// MemberExpression `[` Expression `]`
export function parseMemberExpression(parser: Parser): tl.MemberExpression {
  let object = parsePrimaryExpression(parser);

  while (
    parser._lookahead?.type === TokenTypes.DOT ||
    parser._lookahead?.type === TokenTypes.BRACKET_START
  ) {
    if (parser._lookahead?.type === TokenTypes.DOT) {
      parser._eat(TokenTypes.DOT);
      const property = parseIdentifier(parser);
      object = {
        type: tl.SyntaxKind.MemberExpression,
        computed: false,
        object,
        property,
      } as tl.MemberExpression;
    }
    if (parser._lookahead?.type === TokenTypes.BRACKET_START) {
      parser._eat(TokenTypes.BRACKET_START);
      const property = parseExpression(parser);
      parser._eat(TokenTypes.BRACKET_END);
      object = {
        type: tl.SyntaxKind.MemberExpression,
        computed: true,
        object,
        property,
      } as tl.MemberExpression;
    }
  }

  return object as tl.MemberExpression;
}

// ( Expression )
export function parseParenthesizedExpression(parser: Parser) {
  parser._eat(TokenTypes.PAREN_START);
  const expression = parseExpression(parser);
  parser._eat(TokenTypes.PAREN_END);

  return expression;
}

export function parseNewExpression(parser: Parser) {
  parser._eat(TokenTypes.new);

  return parser.factory.NewExpression(
    parseMemberExpression(parser),
    parseArguments(parser)
  );
}

export function parseThisExpression(parser: Parser) {
  parser._eat(TokenTypes.this);
  return parser.factory.ThisExpression();
}
