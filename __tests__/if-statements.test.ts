// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("IfStatements", () => {
  test("if statement", () => {
    expect(
      parser.parse(`
        if (x) {
          x = 10;
        }
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
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
                    value: 10,
                  },
                },
              },
            ],
          },
          alternate: null,
        },
      ],
    });
  });

  test("if else statement", () => {
    expect(
      parser.parse(`
        if (x) {
          x = 10;
        } else {
          x = 5;
        }
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
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
                    value: 10,
                  },
                },
              },
            ],
          },
          alternate: {
            type: "BlockStatement",
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
                    value: 5,
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("if with expression", () => {
    expect(
      parser.parse(`
        if (x) x = 10;
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
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
                value: 10,
              },
            },
          },
          alternate: null,
        },
      ],
    });
  });
  test("if else with expression", () => {
    expect(
      parser.parse(`
        if (x) x = 10;
        else x = 4;
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
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
                value: 10,
              },
            },
          },
          alternate: {
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
                value: 4,
              },
            },
          },
        },
      ],
    });
  });

  test("nested if", () => {
    expect(
      parser.parse(`
        if (x)
          if (y)
            if (z)  x = 10;
            else x = 1;
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "IfStatement",
            test: {
              type: "Identifier",
              name: "y",
            },
            consequent: {
              type: "IfStatement",
              test: {
                type: "Identifier",
                name: "z",
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
                    value: 10,
                  },
                },
              },
              alternate: {
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
                    value: 1,
                  },
                },
              },
            },
            alternate: null,
          },
          alternate: null,
        },
      ],
    });
  });
});
