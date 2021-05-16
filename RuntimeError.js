class RuntimeError extends Error {
  constructor(msg, token) {
    super(msg);
    this.token = token;
  }
}

module.exports = { RuntimeError };
