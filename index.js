const { Parser } = require("./Parser");

const parser = new Parser();

const source = ` 
  if (x) {
    x = 5;
  }
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
