const { Parser } = require("./Parser");

const parser = new Parser();

const source = ` 
  // Hello world

  /**
   * Multi line 
   */
  "42";

  // Number

  52;

  {
    "hello world";

    500;
  }
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
