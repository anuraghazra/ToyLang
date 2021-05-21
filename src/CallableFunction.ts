import { Interpreter } from "./Interpreter";
import { Environment } from "./Environment";

type NewArgs = {
  call: (...arg0: any[]) => any;
  arity: number;
  toString: (...args: any[]) => string;
};

export interface AbstractCallable {
  call(interpreter: Interpreter, args: any[]): void;
  arity(): number;
  toString(): string;
}

export class CallableFunction implements AbstractCallable {
  call(interpreter: Interpreter, args: any[]) {}
  arity() {
    return 0;
  }
  toString() {
    return `<unimplemented fn>`;
  }

  static new(obj: NewArgs) {
    return new (class CallableFunction {
      call(...args: any[]) {
        return obj.call(...args);
      }
      arity() {
        return obj.arity;
      }
      toString(...args: any[]) {
        obj.toString(...args);
      }
    })();
  }
}

export class ToyLangFunction extends CallableFunction {
  declaration: any;
  closure!: Environment;
  constructor(declaration: any, closure: Environment) {
    super();
    this.declaration = declaration;
    this.closure = closure;
  }

  call(interpreter: Interpreter, args: any[]) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.add(this.declaration.params[i].name, args[i]);
    }
    try {
      interpreter.executeBlock(this.declaration.body.body, environment);
    } catch (returnValue /* instanceof `Return` */) {
      return returnValue.value;
    }
    return null;
  }

  arity() {
    return this.declaration.params.length;
  }

  toString() {
    return "<fn " + this.declaration.name.name + ">";
  }
}
