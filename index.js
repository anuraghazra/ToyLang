const { Parser } = require("./Parser");

const parser = new Parser();

const source = ` 
  let foo = bar = 10;
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
