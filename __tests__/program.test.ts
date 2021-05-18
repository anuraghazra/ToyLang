import { Parser } from "../src/Parser";

test("Test AST", () => {
  const parser = new Parser();
  const parsed = parser.parse(`
    let count = 0;
    let str = "Hello world";

    while(str.length < count) {
      log(str[count]);
      count += 1;
    }
    log(count);
  `);

  expect(parsed).toStrictEqual({
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "count",
            },
            init: {
              type: "NumericLiteral",
              value: 0,
            },
          },
        ],
      },
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "str",
            },
            init: {
              type: "StringLiteral",
              value: "Hello world",
            },
          },
        ],
      },
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          operator: "<",
          left: {
            type: "MemberExpression",
            computed: false,
            object: {
              type: "Identifier",
              name: "str",
            },
            property: {
              type: "Identifier",
              name: "length",
            },
          },
          right: {
            type: "Identifier",
            name: "count",
          },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "log",
                },
                arguments: [
                  {
                    type: "MemberExpression",
                    computed: true,
                    object: {
                      type: "Identifier",
                      name: "str",
                    },
                    property: {
                      type: "Identifier",
                      name: "count",
                    },
                  },
                ],
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "+=",
                left: {
                  type: "Identifier",
                  name: "count",
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
      {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "log",
          },
          arguments: [
            {
              type: "Identifier",
              name: "count",
            },
          ],
        },
      },
    ],
  });
});
