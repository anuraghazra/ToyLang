import { Parser } from "../src/Parser";

const parser = new Parser();

describe("ClassDeclaration", () => {
  test("Simple class", () => {
    expect(
      parser.parse(`
    class Point {
      def constructor(x, y) {
        super(x, y);
        this.x = x;
      }
  
      def calc() {
        return this.x + this.y; 
      }
    }
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          superClass: null,
          id: {
            type: "Identifier",
            name: "Point",
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: {
                  type: "Identifier",
                  name: "constructor",
                },
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "CallExpression",
                        callee: {
                          type: "Super",
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
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "AssignmentExpression",
                        operator: "=",
                        left: {
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression",
                          },
                          property: {
                            type: "Identifier",
                            name: "x",
                          },
                        },
                        right: {
                          type: "Identifier",
                          name: "x",
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
              {
                type: "FunctionDeclaration",
                name: {
                  type: "Identifier",
                  name: "calc",
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
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression",
                          },
                          property: {
                            type: "Identifier",
                            name: "x",
                          },
                        },
                        right: {
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression",
                          },
                          property: {
                            type: "Identifier",
                            name: "y",
                          },
                        },
                      },
                    },
                  ],
                },
                params: [],
              },
            ],
          },
        },
      ],
    });
  });

  test("Class extends with new keyword", () => {
    expect(
      parser.parse(`
      class Point extends Shape {
        def constructor(x, y) {
          super(x, y);
          this.x = x;
        }
    
        def calc() {
          return this.x + this.y; 
        }
      }
    
      let point = new Point(10, 10);
    
      p.calc();
    `)
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          superClass: {
            type: "Identifier",
            name: "Shape",
          },
          id: {
            type: "Identifier",
            name: "Point",
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: {
                  type: "Identifier",
                  name: "constructor",
                },
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "CallExpression",
                        callee: {
                          type: "Super",
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
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "AssignmentExpression",
                        operator: "=",
                        left: {
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression",
                          },
                          property: {
                            type: "Identifier",
                            name: "x",
                          },
                        },
                        right: {
                          type: "Identifier",
                          name: "x",
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
              {
                type: "FunctionDeclaration",
                name: {
                  type: "Identifier",
                  name: "calc",
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
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression",
                          },
                          property: {
                            type: "Identifier",
                            name: "x",
                          },
                        },
                        right: {
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression",
                          },
                          property: {
                            type: "Identifier",
                            name: "y",
                          },
                        },
                      },
                    },
                  ],
                },
                params: [],
              },
            ],
          },
        },
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "point",
              },
              init: {
                type: "NewExpression",
                callee: {
                  type: "Identifier",
                  name: "Point",
                },
                arguments: [
                  {
                    type: "NumericLiteral",
                    value: 10,
                  },
                  {
                    type: "NumericLiteral",
                    value: 10,
                  },
                ],
              },
            },
          ],
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "Identifier",
                name: "p",
              },
              property: {
                type: "Identifier",
                name: "calc",
              },
            },
            arguments: [],
          },
        },
      ],
    });
  });
});
