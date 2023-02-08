import fs from "fs";
import path from "path";
import { Interpreter } from "../src/interpreter/Interpreter";
import { Parser } from "../src/Parser";

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

  interpreter.execute(ast);
}
