import { Parser } from "../src/Parser";

const parser = new Parser();

describe("CallExpression", () => {
  test("normal call", () => {
    expect(
      parser.parse(`
      add();
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "add",
            },
            arguments: [],
          },
        },
      ],
    });
  });

  test("arguments call", () => {
    expect(
      parser.parse(`
      add(x, y);
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "add",
            },
            arguments: [
              {
                type: "Identifier",
                name: "x",
              },
              {
                type: "Identifier",
                name: "y",
              },
            ],
          },
        },
      ],
    });
  });
  test("arguments assignment call", () => {
    expect(
      parser.parse(`
      add(x = 1, y = 10);
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "add",
            },
            arguments: [
              {
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
              {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "y",
                },
                right: {
                  type: "NumericLiteral",
                  value: 10,
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("nested call", () => {
    expect(
      parser.parse(`
      add()();
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "add",
              },
              arguments: [],
            },
            arguments: [],
          },
        },
      ],
    });
  });

  test("member calls", () => {
    expect(
      parser.parse(`
      console.log(1);
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "Identifier",
                name: "console",
              },
              property: {
                type: "Identifier",
                name: "log",
              },
            },
            arguments: [
              {
                type: "NumericLiteral",
                value: 1,
              },
            ],
          },
        },
      ],
    });
  });
});
