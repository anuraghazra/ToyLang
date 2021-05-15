const { Parser } = require("./Parser");

const parser = new Parser();

const source = `
  false == true;
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
