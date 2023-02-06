import chalk from "chalk";
import highlight from "cli-highlight";
import dedent from "dedent";

type Loc = {
  start: number;
  end: number;
};

class ToyLangParserError extends Error {
  constructor({
    message,
    code,
    loc,
  }: {
    message: string;
    code: string;
    loc: Loc;
  }) {
    super();
    this.message = ToyLangParserError.getFormattedError(message, code, loc);
    this.name = "ToyLangParserError";
    this.stack = undefined;
  }

  static getFormattedError(message: string, code: string, loc: Loc) {
    const { line, col } = getLineAndColumnFromIndex(code, loc!.start);

    const lineSource = highlight(code.split("\n")[line - 1], {
      ignoreIllegals: true,
      language: "javascript",
    });

    // TODO: Refactor
    const vBar = chalk.dim(" | ");
    const separator = `${chalk.dim("─").repeat(50)}`;
    const lineNum = `${chalk.green(`${line}`)}${vBar}`;
    const pointerPadding = `${" ".repeat(`${line}`.length)}${vBar}`;
    const pointerArrow =
      pointerPadding + chalk.cyanBright(`${" ".repeat(Math.max(col - 1, 0))}▲`);
    const pointerBody = chalk.cyanBright(
      `${col < 1 ? "│" : "┌"}${"─".repeat(Math.max(col - 2, 0))}${
        col < 1 ? "" : "╯"
      }`
    );
    const errorPointer = `${pointerPadding}${pointerBody}`;

    const errorMessage = chalk.redBright(message);

    const formattedError = dedent`
      \n
      ${separator}
      ${pointerPadding}
      ${lineNum}${lineSource}
      ${pointerArrow}
      ${errorPointer}
      ${pointerPadding}${chalk.cyanBright("╰─| ")}${errorMessage}
      ${separator}
      \n
    `;

    return formattedError;
  }
}

function getLineAndColumnFromIndex(
  source: string,
  index: number | null = null
) {
  if (index === null) index = source.length;

  let i = 0;
  let line = 1;
  let col = 1;
  while (i <= index) {
    if (source.charAt(i) == "\n") {
      line++;
      col = 0;
    } else {
      col++;
    }
    i++;
  }

  return { line, col };
}

export { ToyLangParserError, getLineAndColumnFromIndex };
