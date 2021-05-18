// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Functions", () => {
  test("normal function", () => {
    expect(
      parser.parse(`
      def add() {
        return 1;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "add",
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: {
                  type: "NumericLiteral",
                  value: 1,
                },
              },
            ],
          },
          params: [],
        },
      ],
    });
  });

  test("return null", () => {
    expect(
      parser.parse(`
      def add() {
        return;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "add",
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: null,
              },
            ],
          },
          params: [],
        },
      ],
    });
  });

  test("empty body", () => {
    expect(
      parser.parse(`
      def add() {}
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "add",
          },
          body: {
            type: "BlockStatement",
            body: [],
          },
          params: [],
        },
      ],
    });
  });

  test("params", () => {
    expect(
      parser.parse(`
      def add(x, y) {
        return x + y;
      }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "add",
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: {
                  type: "BinaryExpression",
                  operator: "+",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "Identifier",
                    name: "y",
                  },
                },
              },
            ],
          },
          params: [
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
      ],
    });
  });
});
