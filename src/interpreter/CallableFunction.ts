import { Interpreter } from "./Interpreter";
import { Environment } from "./Environment";

type CallableFunctionCreatorProps = {
  call: (...arg0: any[]) => any;
  arity: number;
  toString: (...args: any[]) => string;
};

export interface AbstractCallable {
  call(interpreter: Interpreter, args: any[]): void;
  arity(...args: any[]): number;
  toString(...args: any[]): string;
}

export class CallableFunction implements AbstractCallable {
  call(interpreter: Interpreter, args: any[]) {
    console.warn(`unimplemented function called`);
  }
  arity() {
    return 0;
  }
  toString() {
    return `<unimplemented fn>`;
  }

  static new(obj: CallableFunctionCreatorProps) {
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
      // @ts-ignore returnValue is unknown
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
