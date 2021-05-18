// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Variables", () => {
  test("let x = 42;", () => {
    expect(parser.parse(`let x = 42;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          ],
        },
      ],
    });
  });

  test("let x;", () => {
    expect(parser.parse(`let x;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
          ],
        },
      ],
    });
  });
  test("let x, y;", () => {
    expect(parser.parse(`let x, y;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "y",
              },
              init: null,
            },
          ],
        },
      ],
    });
  });

  test("let x, y = 10;", () => {
    expect(parser.parse(`let x, y = 10;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "y",
              },
              init: {
                type: "NumericLiteral",
                value: 10,
              },
            },
          ],
        },
      ],
    });
  });

  test("let foo = bar = 10;", () => {
    expect(parser.parse(`let foo = bar = 10;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "foo",
              },
              init: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "bar",
                },
                right: {
                  type: "NumericLiteral",
                  value: 10,
                },
              },
            },
          ],
        },
      ],
    });
  });
});
