import dedent from "dedent";
import colors from "colors/safe";
import highlight from "cli-highlight";
import { Token, Tokenizer, TokenTypes } from "./Tokenizer";
import { ASTFactory, DefaultASTFactory } from "./ASTFactories";
import { parseStatementList } from "./core/statement";

export class Parser {
  _string: string;
  _tokenizer: Tokenizer;
  lookahead!: Token | null;
  factory: ASTFactory;

  constructor(astFactory: ASTFactory = DefaultASTFactory) {
    this._string = "";
    this._tokenizer = new Tokenizer();
    this.factory = astFactory;
  }

  parse(string: string) {
    this._string = string;
    this._tokenizer.init(string);

    // prime the tokenizer by obtaining the first token (predictive parsing)
    this.lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  Program() {
    return this.factory.Program(parseStatementList(this));
  }

  /**
   * Consumes the next token if it matches the specified token type.
   * And advances the lookahead token.
   *
   * Returns the consumed token.
   */
  eat<T extends keyof typeof TokenTypes>(tokenType: T): Token & { type: T } {
    const token = this.lookahead;

    if (token === null) {
      throw new ToyLangParserError({
        message: `Unexpected end of input, expected: "${tokenType}"`,
        code: this._string,
        token: {
          type: TokenTypes.EOF,
          value: "EOF",
          start: this._string.length - 1,
          end: this._string.length,
        },
      });
    }

    if (token.type !== tokenType) {
      throw new ToyLangParserError({
        message: `Unexpected token: "${token.value}", expected: "${tokenType}"`,
        code: this._string,
        token,
      });
    }

    this.lookahead = this._tokenizer.getNextToken();

    return token as Token & { type: T };
  }

  static getLineAndColumnFromIndex(source?: string, index?: number) {
    if (!source || !index) throw new Error("No source or index provided");

    let count = 0;
    let line = 0;
    let col = 0;
    while (count <= index) {
      if (source.charAt(count) == "\n") {
        line++;
        col = 0;
      } else {
        col++;
      }
      count++;
    }

    return { line, col };
  }
}

class ToyLangParserError extends Error {
  constructor({
    message,
    code,
    token,
  }: {
    message: string;
    code: string;
    token?: Token;
  }) {
    super();
    this.message = ToyLangParserError.getFormattedError(message, code, token);
    this.name = "ToyLangParserError";
    this.stack = undefined;
  }

  static getFormattedError(message: string, code: string, token?: Token) {
    const { line, col } = Parser.getLineAndColumnFromIndex(code, token?.start);

    const lineSource = highlight(code.split("\n")[line], {
      ignoreIllegals: true,
      language: "javascript",
    });

    const vBar = colors.dim(" | ");
    const separator = `${colors.dim("-").repeat(20)}`;
    let lineStr = `${colors.green(`${line}`)}${vBar}`;
    let errorPointer = `${" ".repeat(`${line}`.length)}${vBar}${" ".repeat(
      col
    )}^`;
    let errString = `
        ${separator}
        ${" ".repeat(`${line}`.length)}${vBar}
        ${lineStr}${lineSource}
        ${errorPointer}`;

    const errorMessage = colors.red(message);

    const formattedError = dedent`
        \n
        ${errString}
        ${" ".repeat(`${line}`.length)}${vBar}${errorMessage}
        ${separator}
        \n
      `;
    return formattedError;
  }
}

module.exports = { Parser };
