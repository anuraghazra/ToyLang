const { Parser } = require("./Parser");

const parser = new Parser();

const source = `
  def add() {}
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
