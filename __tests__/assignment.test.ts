import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Assignments", () => {
  test("x = 42;", () => {
    expect(parser.parse(`x = 42;`)).toStrictEqual({
      type: "Program",
      body: [
        {
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
              value: 42,
            },
          },
        },
      ],
    });
  });

  test("x = y = 42;", () => {
    expect(parser.parse(`x = y = 42;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "y",
              },
              right: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          },
        },
      ],
    });
  });

  test("x + x;", () => {
    expect(parser.parse(`x + x;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "Identifier",
              name: "x",
            },
          },
        },
      ],
    });
  });

  test("x += 10;", () => {
    expect(parser.parse(`x += 10;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "+=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        },
      ],
    });
  });

  test("x = y + 10;", () => {
    expect(parser.parse(`x = y + 10;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "y",
              },
              right: {
                type: "NumericLiteral",
                value: 10,
              },
            },
          },
        },
      ],
    });
  });
});
