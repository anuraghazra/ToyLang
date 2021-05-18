// @ts-check
import { Parser } from "../src/Parser";

const parser = new Parser();

describe("MemberExpression", () => {
  test("dot notation", () => {
    expect(parser.parse(`a.b;`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: false,
            object: {
              type: "Identifier",
              name: "a",
            },
            property: {
              type: "Identifier",
              name: "b",
            },
          },
        },
      ],
    });
  });

  test("dynamic notation", () => {
    expect(parser.parse(`a["b"];`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: true,
            object: {
              type: "Identifier",
              name: "a",
            },
            property: {
              type: "StringLiteral",
              value: "b",
            },
          },
        },
      ],
    });
  });

  test("nested notation", () => {
    expect(parser.parse(`a.b.c["d"];`)).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: true,
            object: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "MemberExpression",
                computed: false,
                object: {
                  type: "Identifier",
                  name: "a",
                },
                property: {
                  type: "Identifier",
                  name: "b",
                },
              },
              property: {
                type: "Identifier",
                name: "c",
              },
            },
            property: {
              type: "StringLiteral",
              value: "d",
            },
          },
        },
      ],
    });
  });
});
