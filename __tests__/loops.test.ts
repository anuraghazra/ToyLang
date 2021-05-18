// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Loops", () => {
  test("forLoop", () => {
    expect(
      parser.parse(`
      for(let i = 0; i < 5; i += 1) {
        2;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ForStatement",
          test: {
            type: "BinaryExpression",
            operator: "<",
            left: {
              type: "Identifier",
              name: "i",
            },
            right: {
              type: "NumericLiteral",
              value: 5,
            },
          },
          init: {
            type: "VariableStatement",
            declarations: [
              {
                type: "VariableDeclaration",
                id: {
                  type: "Identifier",
                  name: "i",
                },
                init: {
                  type: "NumericLiteral",
                  value: 0,
                },
              },
            ],
          },
          update: {
            type: "AssignmentExpression",
            operator: "+=",
            left: {
              type: "Identifier",
              name: "i",
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("infinite forLoop", () => {
    expect(
      parser.parse(`
      for(;;) {
        2;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ForStatement",
          test: null,
          init: null,
          update: null,
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("infinite forLoop", () => {
    expect(
      parser.parse(`
      for(;;) {
        2;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ForStatement",
          test: null,
          init: null,
          update: null,
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("forLoop with expressions", () => {
    expect(
      parser.parse(`
      for(x+=1; x; 1) {
        2;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ForStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          init: {
            type: "AssignmentExpression",
            operator: "+=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          update: {
            type: "NumericLiteral",
            value: 1,
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("while loop", () => {
    expect(
      parser.parse(`
      while (x < 1) {
        x += 1;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "WhileStatement",
          test: {
            type: "BinaryExpression",
            operator: "<",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          body: {
            type: "BlockStatement",
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
                    value: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("do while loop", () => {
    expect(
      parser.parse(`
      do {
        x += 1;
      } while (x < 1);
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "DoWhileStatement",
          test: {
            type: "BinaryExpression",
            operator: "<",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          body: {
            type: "BlockStatement",
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
                    value: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });
});
