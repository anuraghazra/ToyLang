import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Logical expression", () => {
  test("x > 0 && x < 5;", () => {
    expect(parser.parse(`x > 0 && x < 5;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "LogicalExpression",
            operator: "&&",
            left: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 0,
              },
            },
            right: {
              type: "BinaryExpression",
              operator: "<",
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
        },
      ],
    });
  });
  test("x > 0 || x < 5;", () => {
    expect(parser.parse(`x > 0 || x < 5;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "LogicalExpression",
            operator: "||",
            left: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 0,
              },
            },
            right: {
              type: "BinaryExpression",
              operator: "<",
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
        },
      ],
    });
  });
});
