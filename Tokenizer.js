const spec = [
  [/^\s+/, null],
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],

  // Symbols, Delimiters
  [/^;/, ";"],
  [/^\}/, "}"],
  [/^\{/, "{"],
  [/^\(/, "("],
  [/^\)/, ")"],
  [/^\,/, ","],

  // keywords
  [/^\blet\b/, "let"],
  [/^\bif\b/, "if"],
  [/^\belse\b/, "else"],
  [/^\bwhile\b/, "while"],
  [/^\bdo\b/, "do"],
  [/^\bfor\b/, "for"],
  [/^\btrue\b/, "true"],
  [/^\bfalse\b/, "false"],
  [/^\bnull\b/, "null"],

  // Numbers
  [/^\d+/, "NUMBER"],

  // Identifiers
  [/^\w+/, "IDENTIFIER"],

  // Equality operators
  [/^[=!]=/, "EQUALITY_OPERATOR"],

  // Assignment Operators
  [/^=/, "SIMPLE_ASSIGNMENT"],
  [/^[\*\/\+\-]=/, "COMPLEX_ASSIGNMENT"],

  // Math operators
  [/^[\+\-]/, "ADDITITIVE_OPERATOR"],
  [/^[*\/]/, "MULTIPLICATIVE_OPERATOR"],

  // relational operators
  [/^[><]=?/, "RELATIONAL_OPERATOR"],

  // logical operators
  [/^&&/, "LOGICAL_AND"],
  [/^\|\|/, "LOGICAL_OR"],
  [/^!/, "LOGICAL_NOT"],

  // Strings
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"],
];

class Tokenizer {
  /**
   * @param {string} string
   */
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (let [regex, type] of spec) {
      const tokenValue = this._match(regex, string);

      // cannot match rule, continue
      if (tokenValue === null) {
        continue;
      }

      // skip token (eg: whitespace)
      if (type === null) {
        return this.getNextToken();
      }

      return {
        type,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: "${string[0]}"`);
  }

  /**
   *
   * @param {RegExp} regex
   * @param {string} string
   * @returns
   */
  _match(regex, string) {
    const matched = regex.exec(string);
    if (matched === null) {
      return null;
    }

    this._cursor += matched[0].length;
    return matched[0];
  }
}

module.exports = { Tokenizer };
