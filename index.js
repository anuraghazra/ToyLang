const { Parser } = require("./Parser");

const parser = new Parser();

const source = `
  console.log(1);
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
