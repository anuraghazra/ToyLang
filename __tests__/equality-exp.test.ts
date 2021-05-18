import { Parser } from "../src/Parser";

const parser = new Parser();

describe("EqualityExpression", () => {
  test("x + 3 == true;", () => {
    expect(parser.parse(`x + 3 == true;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "==",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 3,
              },
            },
            right: {
              type: "BooleanLiteral",
              value: true,
            },
          },
        },
      ],
    });
  });

  test("x != false;", () => {
    expect(parser.parse(`x != false;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "!=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "BooleanLiteral",
              value: false,
            },
          },
        },
      ],
    });
  });

  test("false == true;", () => {
    expect(parser.parse(`false == true;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "==",
            left: {
              type: "BooleanLiteral",
              value: false,
            },
            right: {
              type: "BooleanLiteral",
              value: true,
            },
          },
        },
      ],
    });
  });
});
