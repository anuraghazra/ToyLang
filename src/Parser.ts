import { Token, Tokenizer, TokenTypes } from "./Tokenizer";
import { ASTFactory, DefaultASTFactory } from "./ASTFactories";
import { parseStatementList } from "./core/statement";
import { ToyLangParserError } from "./ErrorReporter";

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
        message: `Unexpected end of input: expected: "${tokenType}"`,
        code: this._string,
        loc: {
          start: this._string.length - 1,
          end: this._string.length,
        },
      });
    }

    if (token.type !== tokenType) {
      throw new ToyLangParserError({
        message: `Unexpected token: "${token.value}" expected: "${tokenType}"`,
        code: this._string,
        loc: {
          start: token.start,
          end: token.end,
        },
      });
    }

    this.lookahead = this._tokenizer.getNextToken();

    return token as Token & { type: T };
  }
}

module.exports = { Parser };
