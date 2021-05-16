const { Environment } = require("./Environment");

class CallableFunction {
  /**
   *
   * @param {import("./Interpreter").Interpreter} interpreter
   * @param {any[]} args
   */
  call(interpreter, args) {}
  arity() {}
  toString() {}

  static new(obj) {
    return new (class CallableFunction {
      call(...args) {
        return obj.call(...args);
      }
      arity() {
        return obj.arity;
      }
      toString(...args) {
        obj.toString(...args);
      }
    })();
  }
}

class MusketFunction extends CallableFunction {
  constructor(declaration) {
    super();
    this.declaration = declaration;
  }

  /**
   *
   * @param {import("./Interpreter").Interpreter} interpreter
   * @param {any[]} args
   */
  call(interpreter, args) {
    const environment = new Environment(interpreter.globals);
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

module.exports = { CallableFunction, MusketFunction };
