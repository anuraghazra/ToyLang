import { Type } from "./TypeChecker";

export class TypeEnvironment {
  values: Map<string, Type>;
  parent?: TypeEnvironment | null;
  constructor(parent: TypeEnvironment | null = null) {
    this.values = new Map();
    this.parent = parent;
  }

  add(name: string, value: Type) {
    this.values.set(name, value);
    return value;
  }

  remove(name: string) {
    this.values.delete(name);
  }

  get(name: string): any {
    if (this.values.has(name)) {
      return this.values.get(name);
    }

    if (this.parent !== null) {
      return this.parent?.get(name);
    }

    throw new TypeError(`Undeclared variable "${name}"`);
  }

  assign(name: string, value: Type) {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return value;
    }

    if (this.parent !== null) {
      this.parent?.assign(name, value);
      return value;
    }

    throw new TypeError(`Undeclared variable "${name}"`);
  }
}
