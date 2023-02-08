import { Interpreter } from "../../src/interpreter/Interpreter";
import { Parser } from "../../src/Parser";

const parser = new Parser();
const interpreter = new Interpreter();

describe("Interpreter", () => {
  test("Simple 1+1", () => {
    console.log = jest.fn();

    const source = `print(1+1);`;

    const ast = parser.parse(source);

    interpreter.execute(ast);

    expect(console.log).toHaveBeenCalledWith(2);
  });

  test("factorial", () => {
    console.log = jest.fn();

    const source = `
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

    interpreter.execute(ast);

    expect(console.log).toHaveBeenCalledWith("Factorial result:", 720);
  });

  test("fib", () => {
    console.log = jest.fn();

    const source = `
      // Comments
      def fib(n) {
        if (n <= 1) return n;
        return fib(n - 2) + fib(n - 1);
      }

      for (let i = 0; i < 10; i = i + 1) {
        print(fib(i));
      }
    `;

    const ast = parser.parse(source);

    interpreter.execute(ast);

    expect(console.log).toBeCalledTimes(10);
    expect(console.log).toHaveBeenCalledWith(0);
    expect(console.log).toHaveBeenCalledWith(1);
    expect(console.log).toHaveBeenCalledWith(1);
    expect(console.log).toHaveBeenCalledWith(2);
    expect(console.log).toHaveBeenCalledWith(3);
    expect(console.log).toHaveBeenCalledWith(5);
    expect(console.log).toHaveBeenCalledWith(8);
    expect(console.log).toHaveBeenCalledWith(13);
    expect(console.log).toHaveBeenCalledWith(21);
    expect(console.log).toHaveBeenCalledWith(34);
  });
});
