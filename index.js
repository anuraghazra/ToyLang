const { Parser } = require("./Parser");

const parser = new Parser();

const source = `
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
`;

const ast = parser.parse(source);

console.log(JSON.stringify(ast, null, 2));
