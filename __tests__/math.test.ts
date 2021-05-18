// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Binary expressions", () => {
  test("2 + 2", () => {
    expect(parser.parse(`2 + 2;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });

  // left: 3+2
  // right: 2
  test("3 + 2 - 2", () => {
    expect(parser.parse(`3 + 2 - 2;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "-",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 3,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });

  test("2 + 2 * 2;", () => {
    expect(parser.parse(`2 + 2 * 2;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
          },
        },
      ],
    });
  });

  test("2 * 2 * 2;", () => {
    expect(parser.parse(`2 * 2 * 2;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });

  test("(2 + 2) * 2;", () => {
    expect(parser.parse(`(2 + 2) * 2;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });
});
