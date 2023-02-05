import { TypeEnvironment } from "./TypeEnvironment";
import { tl } from "./typings";

class TypeChecker {
  globalEnv: TypeEnvironment;
  constructor() {
    this.globalEnv = new TypeEnvironment();
    this.globalEnv.add("CURRENT_TIME", Type.number);
  }

  check(exp: tl.PrimaryExpression, env = this.globalEnv) {
    if (exp.type === tl.SyntaxKind.Program) {
      return exp.body.map((statement) => {
        if (statement.type === tl.SyntaxKind.ExpressionStatement) {
          return this.checkExpression(statement.expression, env);
        }
        if (statement.type === tl.SyntaxKind.VariableStatement) {
          return this.checkExpression(statement, env);
        }
        return [];
      });
    }

    if (exp.type === tl.SyntaxKind.ExpressionStatement) {
      return [this.checkExpression(exp.expression, env)];
    }

    return [];
  }

  checkExpression(exp: tl.PrimaryExpression, env: TypeEnvironment): Type {
    if (exp.type === tl.SyntaxKind.Identifier) {
      return env.get(exp.name);
    }

    if (exp.type === tl.SyntaxKind.NumericLiteral) {
      return Type.number;
    }

    if (exp.type === tl.SyntaxKind.StringLiteral) {
      return Type.string;
    }

    if (exp.type === tl.SyntaxKind.BinaryExpression) {
      const t1 = this.checkExpression(exp.left, env);
      const t2 = this.checkExpression(exp.right, env);

      const allowedTypes = this.getOperandTypesForOperator(exp.operator);

      this.expectOperatorType(t1, allowedTypes, exp);
      this.expectOperatorType(t2, allowedTypes, exp);

      return this.expect(t2, t1, exp.right, exp);
    }

    if (exp.type === tl.SyntaxKind.VariableStatement) {
      const dec = exp.declarations[0];
      if (dec.init === null) return Type.never;
      const valueType = this.checkExpression(dec.init!, env);

      if (dec.typeAnnotation) {
        this.expect(
          valueType,
          Type.fromString(dec.typeAnnotation),
          dec.init!,
          dec
        );

        return env.add(dec.id.name, valueType);
      }

      return env.add(dec.id.name, valueType);
    }

    if (exp.type === tl.SyntaxKind.TypeCastExpression) {
      const castedType = Type.fromString(exp.typeAnnotation);
      return castedType;
    }

    return Type.never;
    // throw new Error(`Unexpected type ${exp.type}`);
  }

  getOperandTypesForOperator(operator: string) {
    switch (operator) {
      case "+":
        return [Type.number, Type.string];
      case "-":
        return [Type.number];
      case "/":
        return [Type.number];
      case "*":
        return [Type.number];
      default:
        throw new Error(`Unexpected operator ${operator}`);
    }
  }

  expectOperatorType(
    type: Type,
    allowedTypes: Type[],
    exp: tl.PrimaryExpression
  ): Type {
    if (!allowedTypes.some((t) => t.equals(type))) {
      throw new TypeError(
        `Expected type "${allowedTypes
          .map((t) => t.getName())
          .join(" or ")}" for operator "${
          // @ts-ignore
          exp.operator
        }" but got "${type.getName()}"`
      );
    }
    return type;
  }

  expect(
    actualType: Type | null,
    expectedType: Type | null,
    value: any,
    exp: tl.PrimaryExpression
  ) {
    if (!actualType?.equals(expectedType)) {
      throw new TypeError(
        `Expected type "${expectedType?.getName()}" in ${
          exp.type
        } but got "${actualType?.getName()}"`
      );
    }
    return actualType;
  }
}

export class Type {
  name: string;
  static number: Type;
  static string: Type;
  static never: Type;
  static boolean: any;
  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  toString() {
    return this.getName();
  }

  equals(other: Type | null) {
    return this.name === other?.name;
  }

  static fromString(typeStr: tl.TypeKind): Type {
    switch (typeStr) {
      case "number":
        return Type.number;
      case "string":
        return Type.string;
      case "boolean":
        return Type.boolean;
      default:
        return Type.never;
    }
  }
}

Type.number = new Type("number");
Type.string = new Type("string");
Type.boolean = new Type("boolean");
Type.never = new Type("never");

export { TypeChecker };
