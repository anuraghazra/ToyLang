import { Parser } from "../Parser";
import { Token, TokenTypes } from "../Tokenizer";
import { tl } from "../typings";
import { parseLogicalORExpression } from "./binop";
import { parseIdentifier, parseSuper } from "./identifiers";
import { isLiteral, parseLiteral } from "./literals";
import { parseArguments } from "./statement";

export function parseExpression(parser: Parser) {
  return parseAssignmentExpression(parser);
}

export function parsePrimaryExpression(parser: Parser): tl.PrimaryExpression {
  if (isLiteral(parser.lookahead?.type)) {
    return parseLiteral(parser);
  }
  switch (parser.lookahead?.type) {
    case TokenTypes.IDENTIFIER:
      return parseIdentifier(parser);
    case TokenTypes.this:
      return parseThisExpression(parser);
    case TokenTypes.new:
      return parseNewExpression(parser);
    case TokenTypes.PAREN_START:
      return parseParenthesizedExpression(parser);
    case TokenTypes.super:
      return parseLeftHandSideExpression(parser);
  }

  throw parser.panic({
    type: "UnexpectedToken",
    message: ({ got, expected }) => {
      return [
        `Unexpected token "${got}" expected "PrimaryExpression"`,
        `PrimaryExpression := ${expected}`,
      ];
    },
    expected: [
      TokenTypes.IDENTIFIER,
      TokenTypes.this,
      TokenTypes.new,
      TokenTypes.super,
      "ParenthesizedExpression",
    ],
  });
}

// LefthandSideExpression ASSIGNMENT_OPERATOR AssignmentExpression
export function parseAssignmentExpression(parser: Parser): tl.Expression {
  let left = parseLogicalORExpression(parser);

  if (!isAssignmentOperator(parser.lookahead?.type)) {
    return left;
  }

  return parser.factory.AssignmentExpression({
    operator: parseAssignmentOperator(parser).value as tl.AssignmentOperators,
    left: checkValidAssignmentTarget(left, parser, parser.lookahead!),
    right: parseAssignmentExpression(parser),
  });
}

export function parseAssignmentOperator(parser: Parser) {
  if (parser.lookahead?.type === TokenTypes.SIMPLE_ASSIGNMENT) {
    return parser.eat(TokenTypes.SIMPLE_ASSIGNMENT);
  }
  return parser.eat(TokenTypes.COMPLEX_ASSIGNMENT);
}

export function checkValidAssignmentTarget<
  T extends tl.BinaryExpression["left"]
>(node: T, parser: Parser, token: Token): T {
  if (
    node.type === tl.SyntaxKind.Identifier ||
    node.type === tl.SyntaxKind.MemberExpression
  ) {
    return node;
  }

  throw parser.panic({
    type: "InvalidAssignmentTarget",
    message: ({ got, expected }) => {
      return [
        `Invalid left-hand side in assignment expression, expected "${expected}" but got "${got}"`,
      ];
    },
    expected: ["Identifier", "MemberExpression"],
  });
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

  switch (parser.lookahead?.type) {
    case TokenTypes.ADDITITIVE_OPERATOR:
      operator = parser.eat(TokenTypes.ADDITITIVE_OPERATOR).value;
      break;
    case TokenTypes.LOGICAL_NOT:
      operator = parser.eat(TokenTypes.LOGICAL_NOT).value;
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
  if (parser.lookahead?.type === TokenTypes.super) {
    return parseCallExpression(parser, parseSuper(parser));
  }

  const member = parseMemberExpression(parser);

  if (parser.lookahead?.type === TokenTypes.PAREN_START) {
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

  if (parser.lookahead?.type === TokenTypes.PAREN_START) {
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
    parser.lookahead?.type === TokenTypes.DOT ||
    parser.lookahead?.type === TokenTypes.BRACKET_START
  ) {
    if (parser.lookahead?.type === TokenTypes.DOT) {
      parser.eat(TokenTypes.DOT);
      const property = parseIdentifier(parser);

      if (
        object.type === tl.SyntaxKind.NumericLiteral &&
        property.type === tl.SyntaxKind.Identifier
      ) {
        throw parser.panic({
          type: "InvalidIdentifierAfterNumericLiteral",
          message: ({ got }) => {
            return [`Identifier "${got}" is not valid after numeric literal`];
          },
        });
      }

      object = {
        type: tl.SyntaxKind.MemberExpression,
        computed: false,
        object,
        property,
      } as tl.MemberExpression;
    }
    if (parser.lookahead?.type === TokenTypes.BRACKET_START) {
      parser.eat(TokenTypes.BRACKET_START);
      const property = parseExpression(parser);
      parser.eat(TokenTypes.BRACKET_END);
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
  parser.eat(TokenTypes.PAREN_START);
  const expression = parseExpression(parser);
  parser.eat(TokenTypes.PAREN_END);

  return expression;
}

export function parseNewExpression(parser: Parser) {
  parser.eat(TokenTypes.new);

  return parser.factory.NewExpression(
    parseMemberExpression(parser),
    parseArguments(parser)
  );
}

export function parseThisExpression(parser: Parser) {
  parser.eat(TokenTypes.this);
  return parser.factory.ThisExpression();
}
