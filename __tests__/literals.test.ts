// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("Literals", () => {
  test("number", () => {
    expect(parser.parse(`42;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumericLiteral",
            value: 42,
          },
        },
      ],
    });
  });

  test("string", () => {
    expect(parser.parse(`"42";`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "42",
          },
        },
      ],
    });
  });
});
