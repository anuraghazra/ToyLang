import { Parser } from "../src/Parser";

const parser = new Parser();

describe("UnaryExpression", () => {
  test("-1;", () => {
    expect(parser.parse(`-1;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "UnaryExpression",
            operator: "-",
            argument: {
              type: "NumericLiteral",
              value: 1,
            },
          },
        },
      ],
    });
  });

  test("!1;", () => {
    expect(parser.parse(`!1;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "UnaryExpression",
            operator: "!",
            argument: {
              type: "NumericLiteral",
              value: 1,
            },
          },
        },
      ],
    });
  });

  test("-1 * +1;", () => {
    expect(parser.parse(`-1 * +1;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "UnaryExpression",
              operator: "-",
              argument: {
                type: "NumericLiteral",
                value: 1,
              },
            },
            right: {
              type: "UnaryExpression",
              operator: "+",
              argument: {
                type: "NumericLiteral",
                value: 1,
              },
            },
          },
        },
      ],
    });
  });
  test("--x;", () => {
    expect(parser.parse(`--x;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "UnaryExpression",
            operator: "-",
            argument: {
              type: "UnaryExpression",
              operator: "-",
              argument: {
                type: "Identifier",
                name: "x",
              },
            },
          },
        },
      ],
    });
  });
});
