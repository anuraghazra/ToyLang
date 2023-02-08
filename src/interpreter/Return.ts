export class Return extends ReferenceError {
  value: any;
  constructor(value: any) {
    super();
    this.value = value;
  }
}
