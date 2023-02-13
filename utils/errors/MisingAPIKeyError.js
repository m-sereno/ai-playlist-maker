export default class MisingAPIKeyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}