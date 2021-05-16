class Return extends ReferenceError {
  constructor(value) {
    super();
    this.value = value;
  }
}

module.exports = { Return };
