const { Parser } = require("./Parser");
const { Interpreter } = require("./Interpreter");

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
  // calculate the factorial of a number
  // 4's factorial = 1*2*3*4 
  def factorial(n) {
    let fac = 1;
    for (let i = 1; i < n + 1; i +=1) {
      fac *= i;
    } 

    return fac;
  }
  
  print("Factorial result:", factorial(6));
`;

const ast = parser.parse(source);

const result = interpreter.execute(ast);

// console.log(JSON.stringify(ast, null, 2));
