const { RuntimeError } = require("./RuntimeError");

class Environment {
  constructor(enclosing = null) {
    this.values = new Map();
    this.enclosing = enclosing;
  }

  add(name, value) {
    this.values.set(name, value);
  }

  remove(name, value) {
    this.values.delete(name, value);
  }

  get(name) {
    if (this.values.has(name)) {
      return this.values.get(name);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throw new RuntimeError(name, `Undeclared variable "${name}"`);
  }

  assign(name, value) {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undeclared variable "${name}"`);
  }
}

module.exports = { Environment };
