const { Parser } = require("./Parser");

const parser = new Parser();

const source = `
x > 0 || x < 5;
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
