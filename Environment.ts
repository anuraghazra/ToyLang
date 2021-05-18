import { RuntimeError } from "./RuntimeError";

export class Environment {
  values: Map<any, any>;
  enclosing?: Environment | null;
  constructor(enclosing: Environment | null = null) {
    this.values = new Map();
    this.enclosing = enclosing;
  }

  add(name: string, value: any) {
    this.values.set(name, value);
  }

  remove(name: string) {
    this.values.delete(name);
  }

  get(name: string): any {
    if (this.values.has(name)) {
      return this.values.get(name);
    }

    if (this.enclosing !== null) {
      return this.enclosing?.get(name);
    }

    throw new RuntimeError(name, `Undeclared variable "${name}"`);
  }

  assign(name: string, value: any) {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing?.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undeclared variable "${name}"`);
  }
}
