// @ts-check
const { Parser } = require("../Parser");

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
            value: "42",
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: `"Hello"`,
          },
        },
      ],
    });
  });
});
