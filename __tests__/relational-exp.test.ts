import { Parser } from "../src/Parser";

const parser = new Parser();

describe("RelationalExpression", () => {
  test("x > 3;", () => {
    expect(parser.parse(`x > 3;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ],
    });
  });

  test("x >= 3;", () => {
    expect(parser.parse(`x >= 3;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ],
    });
  });
  test("x + 5 > 3;", () => {
    expect(parser.parse(`x + 5 > 3;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 5,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ],
    });
  });

  test("if (x >= 3) x = 5;", () => {
    expect(parser.parse(`if (x >= 3) x = 5;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            operator: ">=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
          consequent: {
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 5,
              },
            },
          },
          alternate: null,
        },
      ],
    });
  });
});
