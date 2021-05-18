// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Statements", () => {
  test("multiple statements", () => {
    expect(
      parser.parse(`
        42;
        "Hello";
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumericLiteral",
            value: 42,
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "Hello",
          },
        },
      ],
    });
  });

  test("empty statements", () => {
    expect(parser.parse(`;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "EmptyStatement",
        },
      ],
    });
  });

  test("block statements", () => {
    expect(
      parser.parse(`
        {
          42;
          "Hello";
        }
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumericLiteral",
                value: 42,
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "Hello",
              },
            },
          ],
        },
      ],
    });
  });

  test("nested block statements", () => {
    expect(
      parser.parse(`
        {
          42;
          { 
            "Hello"; 
          }
        }
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumericLiteral",
                value: 42,
              },
            },
            {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "StringLiteral",
                    value: "Hello",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("empty block statements", () => {
    expect(
      parser.parse(`
        {}
      `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [],
        },
      ],
    });
  });
});
