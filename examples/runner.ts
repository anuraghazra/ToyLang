import fs from "fs";
import path from "path";
import { Interpreter } from "../src/Interpreter";
import { Parser } from "../src/Parser";
import { TypeChecker } from "../src/TypeChecker";

const args = process.argv.slice(2);

if (!args) throw new Error("Please provide a example name");

run(args[0]);

function run(file: string) {
  const parser = new Parser();
  const interpreter = new Interpreter();

  const ast = parser.parse(
    fs.readFileSync(path.join(process.cwd(), "examples", `${file}.toy`), {
      encoding: "utf-8",
    })
  );

  try {
    const checker = new TypeChecker();
    checker.check(ast);
  } catch (err) {
    const fgRed = "\x1b[31m";
    const reset = "\x1b[0m";
    console.log(fgRed, `[ToyLang TypeChecker]: ${err.message}`, reset);
  }

  interpreter.execute(ast);
}
