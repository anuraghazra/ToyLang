import { Environment } from "./Environment";
import { ToyLang } from "./typings";

import { CallableFunction, MusketFunction } from "./CallableFunction";
import { RuntimeError } from "./RuntimeError";
import { Return } from "./Return";

function checkNumberOperands(
  node: any,
  left: string | number,
  right: string | number
) {
  if (typeof left === "number" && typeof right === "number") return true;

  throw new RuntimeError("Operands must be numbers.", node);
}

function checkNumberOperand(node: any, operand: string | number) {
  if (typeof operand === "number") return;

  throw new RuntimeError("Operand must be number.", node);
}

export class Interpreter {
  ast: ToyLang.Program | null;
  globals: Environment;
  environment: Environment;
  constructor() {
    this.ast = null;
    this.globals = new Environment();

    this.globals.add(
      "time",
      CallableFunction.new({
        arity: 0,
        call() {
          return +new Date() / 1000.0;
        },
        toString() {
          return `<native fn>`;
        },
      })
    );
    this.globals.add(
      "mod",
      CallableFunction.new({
        arity: 2,
        call(_: any, args: number[]) {
          return args[0] % args[1];
        },
        toString() {
          return `<native fn>`;
        },
      })
    );

    this.globals.add(
      "print",
      CallableFunction.new({
        arity: Infinity,
        call(interpreter, args) {
          console.log(...args);
        },
        toString() {
          return `<native fn>`;
        },
      })
    );

    this.environment = this.globals;
  }

  execute(ast: ToyLang.Program) {
    this.ast = ast;

    return this.visit(this.ast);
  }

  visit(
    node:
      | null
      | ToyLang.Statement
      | ToyLang.Expression
      | ToyLang.UnaryExpression
      | ToyLang.BinaryExpression
      | ToyLang.CallExpression
      | ToyLang.Program
      | ToyLang.Literal
      | ToyLang.Identifier
  ): number | string | CallableFunction | null | boolean | void {
    if (node == null) return;

    switch (node.type) {
      case "ExpressionStatement":
        return this.visitExpression(node);
      case "IfStatement":
        return this.visitIfStatement(node);
      case "WhileStatement":
        return this.visitWhileStatement(node);
      case "ForStatement":
        return this.visitForStatement(node);
      case "VariableStatement":
        return this.visitVariableStatement(node);
      case "BlockStatement":
        return this.visitBlockStatement(node);
      case "CallExpression":
        return this.visitCallExpression(node);
      case "UnaryExpression":
        return this.visitUnaryExpression(node);
      case "BinaryExpression":
        return this.visitBinaryExpression(node);
      case "LogicalExpression":
        return this.visitLogicalExpression(node);
      case "AssignmentExpression":
        return this.visitAssignmentExpression(node);
      case "FunctionDeclaration":
        return this.visitFunctionDeclaration(node);
      case "ReturnStatement":
        return this.visitReturnStatement(node);
      case "Program":
        return this.visitProgram(node);
      case "NumericLiteral":
      case "StringLiteral":
        return this.visitLiterals(node);
      case "Identifier":
        return this.visitIdentifier(node);

      default:
        return null;
    }
  }

  visitIdentifier(
    node: ToyLang.Identifier
  ): number | string | CallableFunction {
    return this.environment.get(node.name);
  }

  visitExpression(node: ToyLang.ExpressionStatement) {
    return this.visit(node.expression);
  }

  visitAssignmentExpression(node: ToyLang.AssignmentExpression) {
    let value = this.visit(node.right);

    const left = node.left as ToyLang.Identifier;
    let lhs = this.environment.get(left.name);

    switch (node.operator) {
      case "=":
        this.environment.assign(left.name, value);
        break;
      case "+=":
        lhs += value;
        this.environment.assign(left.name, lhs);
        break;
      case "-=":
        if (typeof value !== "number") {
          throw new RuntimeError("Operand must be a number", node);
        }
        lhs -= value;
        this.environment.assign(left.name, lhs);
        break;
      case "/=":
        if (typeof value !== "number") {
          throw new RuntimeError("Operand must be a number", node);
        }
        lhs /= value;
        this.environment.assign(left.name, lhs);
        break;
      case "*=":
        if (typeof value !== "number") {
          throw new RuntimeError("Operand must be a number", node);
        }
        lhs *= value;
        this.environment.assign(left.name, lhs);
        break;
    }

    return lhs;
  }

  visitReturnStatement(node: ToyLang.ReturnStatement) {
    let value = null;
    if (node.argument !== null) value = this.visit(node.argument);

    throw new Return(value);
  }

  visitFunctionDeclaration(node: ToyLang.FunctionDeclaration) {
    let fun = new MusketFunction(node);
    this.environment.add(node.name.name, fun);
    return null;
  }
  visitCallExpression(node: ToyLang.CallExpression) {
    // this.printFunction(node);
    // calle should be MusketFunction.
    const callee = this.visit(node.callee) as CallableFunction;

    if ((!(callee as any).prototype as unknown) instanceof CallableFunction) {
      throw new RuntimeError("Can only call functions and classes", node);
    }

    const args = [];
    for (const argument of node.arguments) {
      args.push(this.visit(argument));
    }

    // Todo fix infinity
    if (args.length != callee.arity() && callee.arity() !== Infinity) {
      throw new RuntimeError(
        "Expected " +
          callee.arity() +
          " arguments but got " +
          args.length +
          ".",
        node
      );
    }

    return callee.call(this, args);
  }

  visitVariableStatement(node: ToyLang.VariableStatement) {
    for (const declaration of node.declarations) {
      let value = null;
      if (declaration.init != null) {
        value = this.visit(declaration.init);
      }

      this.environment.add(declaration.id.name, value);
      return null;
    }
    return null;
  }

  visitBlockStatement(node: ToyLang.BlockStatement) {
    this.executeBlock(node.body, new Environment(this.environment));
    return null;
  }

  // scopes!!
  executeBlock(statements: ToyLang.Statement[], environment: Environment) {
    // save the current env
    const previous = this.environment;
    try {
      // set the current env to the block's env
      this.environment = environment;

      for (const statement of statements) {
        this.visit(statement);
      }
    } finally {
      // restore the previous env
      this.environment = previous;
    }
  }

  visitIfStatement(node: ToyLang.IfStatement) {
    const test = this.visit(node.test);

    if (test) {
      this.visit(node.consequent);
    } else if (node.alternate !== null) {
      this.visit(node.alternate);
    }
    return null;
  }

  visitWhileStatement(node: ToyLang.WhileStatement) {
    while (this.visit(node.test)) {
      this.visit(node.body);
    }
    return null;
  }

  visitForStatement(node: ToyLang.ForStatement) {
    // hacky
    if (node.init === null && node.test === null && node.update === null) {
      for (;;) {
        this.visit(node.body);
      }
    }

    for (
      this.visit(node.init);
      this.visit(node.test);
      this.visit(node.update)
    ) {
      this.visit(node.body);
    }
    return null;
  }

  visitBinaryExpression(node: ToyLang.BinaryExpression) {
    const op = node.operator;

    let left = this.visit(node.left) as number;
    let right = this.visit(node.right) as number;

    switch (op) {
      case "==":
        return left == right;

      case "!=":
        return left != right;

      case "+":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        throw new RuntimeError(
          `Runtime: Mismatched type, cannot "${typeof left}" + "${typeof right}"`,
          node
        );

      case "-":
        checkNumberOperands(node, left, right);
        return left - right;

      case "/":
        checkNumberOperands(node, left, right);
        return left / right;

      case "*":
        checkNumberOperands(node, left, right);
        return left * right;

      case ">":
        checkNumberOperands(node, left, right);
        return left > right;

      case "<":
        checkNumberOperands(node, left, right);
        return left < right;

      case ">=":
        checkNumberOperands(node, left, right);
        return left >= right;

      case "<=":
        checkNumberOperands(node, left, right);
        return left <= right;
    }

    throw new Error("Runtime: Unknown Binary operation");
  }

  visitLogicalExpression(node: ToyLang.LogicalExpression) {
    const op = node.operator;

    let left = this.visit(node.left);
    let right = this.visit(node.right);

    switch (op) {
      case "&&":
        return left && right;
      case "||":
        return left || right;
    }

    throw new Error("Runtime: Unknown Logical operation");
  }

  visitLiterals(node: ToyLang.Literal) {
    switch (node.type) {
      case "NumericLiteral":
        return node.value;
      case "StringLiteral":
        return node.value;
      case "BooleanLiteral":
        return node.value;
      case "NullLiteral":
        return null;

      default:
        throw new SyntaxError("Runtime: Unexpected literal");
    }
  }

  visitUnaryExpression(node: ToyLang.UnaryExpression) {
    const right = this.visit(node.argument as ToyLang.CallExpression);

    switch (node.operator) {
      case "-":
        checkNumberOperand(node, right as number);
        return -(right as number);
      case "+":
        return right;
      case "!":
        return !right;
    }

    return null;
  }

  visitProgram(node: ToyLang.Program) {
    node.body.map((statement) => this.visit(statement));
    return null;
  }
}
