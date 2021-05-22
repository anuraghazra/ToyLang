// this file is only for testing
import { Parser } from "./src/Parser";
import { Interpreter } from "./src/Interpreter";

const parser = new Parser();
const interpreter = new Interpreter();

const fibonacciSource = `
  // Comments
  def fib(n) {
    if (n <= 1) return n;
    return fib(n - 2) + fib(n - 1);
  }

  for (let i = 0; i < 20; i = i + 1) {
    print(fib(i));
  }
`;

const fizzBuzzSource = `
  def fizzBuzz(iter){
    let str = '';
    if(!(mod(iter, 3))) str += 'Fizz';
    if(!(mod(iter, 5))) str += 'Buzz';

    print(str || iter);

    if(iter >= 100) return;

    fizzBuzz(1 + iter);
  }
  fizzBuzz(1);
`;

const source = `
let a = "global";
{
  def showA() {
    print(a);
  }

  showA();
  let a = "block";
  showA();
}
`;

const ast = parser.parse(source);

const result = interpreter.execute(ast);

// console.log(JSON.stringify(ast, null, 2));
