import { CallableFunction } from "./CallableFunction";

export const stdlib = {
  time: CallableFunction.new({
    arity: 0,
    call() {
      return +new Date() / 1000.0;
    },
    toString() {
      return `<native fn>`;
    },
  }),
  mod: CallableFunction.new({
    arity: 2,
    call(_: any, args: number[]) {
      return args[0] % args[1];
    },
    toString() {
      return `<native fn>`;
    },
  }),
  print: CallableFunction.new({
    arity: Infinity,
    call(interpreter, args) {
      console.log(...args);
    },
    toString() {
      return `<native fn>`;
    },
  }),
};
