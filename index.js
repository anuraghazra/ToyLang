const { Parser } = require("./Parser");

const parser = new Parser();

const source = `
  for(x+=1; x; 1) {
    2;
  }
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
